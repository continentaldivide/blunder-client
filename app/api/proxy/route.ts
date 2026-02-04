import { NextResponse } from "next/server";
import dns from "node:dns";

type ProxyRequest = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

const MAX_RESPONSE_BYTES = 1024 * 1024; // 1MB
let dnsConfigured = false;

function isHttpUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function pickSerializableHeaders(headers: Headers) {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    // Skip headers that are not useful / can be huge / can vary per platform.
    if (key.toLowerCase() === "set-cookie") return;
    out[key] = value;
  });
  return out;
}

function looksTextual(contentType: string | null) {
  const ct = (contentType ?? "").toLowerCase();
  return (
    ct.includes("application/json") ||
    ct.startsWith("text/") ||
    ct.includes("application/xml") ||
    ct.includes("application/xhtml") ||
    ct.includes("application/javascript") ||
    ct.includes("application/x-www-form-urlencoded")
  );
}

export async function POST(req: Request) {
  // Avoid the common ~1–2s IPv6→IPv4 fallback penalty on networks with flaky IPv6 (often WSL).
  if (!dnsConfigured) {
    dns.setDefaultResultOrder("ipv4first");
    dnsConfigured = true;
  }

  const startedAt = performance.now();
  let payload: ProxyRequest;

  try {
    payload = (await req.json()) as ProxyRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = payload.url?.trim();
  if (!url || !isHttpUrl(url)) {
    return NextResponse.json(
      { error: "Please provide a valid http(s) URL." },
      { status: 400 },
    );
  }

  const method = (payload.method || "GET").toUpperCase();
  const headers = new Headers(payload.headers || {});

  // Avoid forwarding hop-by-hop headers.
  headers.delete("host");
  headers.delete("content-length");

  // Default accept header for convenience.
  if (!headers.has("accept")) headers.set("accept", "*/*");

  const body =
    method === "GET" || method === "HEAD" ? undefined : payload.body ?? undefined;

  try {
    const upstreamRes = await fetch(url, {
      method,
      headers,
      body,
      redirect: "follow",
      cache: "no-store",
    });

    const contentType = upstreamRes.headers.get("content-type");
    const isText = looksTextual(contentType);

    // Read up to MAX_RESPONSE_BYTES (+1 to detect truncation).
    const buf = await upstreamRes.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const truncated = bytes.byteLength > MAX_RESPONSE_BYTES;
    const slice = truncated ? bytes.slice(0, MAX_RESPONSE_BYTES) : bytes;

    let bodyText: string | null = null;
    let bodyBase64: string | null = null;
    if (isText) {
      bodyText = new TextDecoder("utf-8", { fatal: false }).decode(slice);
    } else {
      // Node runtime: Buffer is available.
      bodyBase64 = Buffer.from(slice).toString("base64");
    }

    const durationMs = Math.round(performance.now() - startedAt);

    return NextResponse.json({
      ok: upstreamRes.ok,
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      durationMs,
      url,
      method,
      response: {
        contentType,
        headers: pickSerializableHeaders(upstreamRes.headers),
        bytes: bytes.byteLength,
        truncated,
        bodyText,
        bodyBase64,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

