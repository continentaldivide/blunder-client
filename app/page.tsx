"use client";

import { useMemo, useState } from "react";

type ProxyResponse =
  | {
    ok: boolean;
    status: number;
    statusText: string;
    durationMs: number;
    url: string;
    method: string;
    response: {
      contentType: string | null;
      headers: Record<string, string>;
      bytes: number;
      truncated: boolean;
      bodyText: string | null;
      bodyBase64: string | null;
    };
  }
  | { error: string };

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function isSuccessResponse(r: ProxyResponse | null): r is Exclude<ProxyResponse, { error: string }> {
  return !!r && "response" in r;
}

function parseHeaderLines(text: string) {
  const out: Record<string, string> = {};
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

function prettyMaybeJson(bodyText: string | null, contentType: string | null) {
  if (!bodyText) return null;
  const ct = (contentType ?? "").toLowerCase();
  const looksJson = ct.includes("application/json") || bodyText.trim().startsWith("{") || bodyText.trim().startsWith("[");
  if (!looksJson) return bodyText;
  try {
    return JSON.stringify(JSON.parse(bodyText), null, 2);
  } catch {
    return bodyText;
  }
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

function tryParseJson(bodyText: string | null, contentType: string | null): JsonValue | null {
  if (!bodyText) return null;
  const ct = (contentType ?? "").toLowerCase();
  const looksJson = ct.includes("application/json") || bodyText.trim().startsWith("{") || bodyText.trim().startsWith("[");
  if (!looksJson) return null;
  try {
    return JSON.parse(bodyText) as JsonValue;
  } catch {
    return null;
  }
}

function isJsonContainer(v: JsonValue) {
  return v !== null && typeof v === "object";
}

function JsonScalar({ value }: { value: Exclude<JsonValue, JsonValue[] | { [k: string]: JsonValue }> }) {
  if (value === null) return <span className="text-zinc-500">null</span>;
  if (typeof value === "string") return <span className="text-emerald-700 dark:text-emerald-300">"{value}"</span>;
  if (typeof value === "number") return <span className="text-sky-700 dark:text-sky-300">{value}</span>;
  return <span className="text-violet-700 dark:text-violet-300">{String(value)}</span>;
}

function JsonTree({
  value,
  name,
  defaultOpen = false,
  depth = 0,
}: {
  value: JsonValue;
  name?: string;
  defaultOpen?: boolean;
  depth?: number;
}) {
  const isArray = Array.isArray(value);
  const isObject = !isArray && value !== null && typeof value === "object";

  const label =
    name != null
      ? name
      : isArray
        ? "Array"
        : isObject
          ? "Object"
          : "Value";

  const summaryValue = (() => {
    if (value === null) return <span className="text-zinc-500">null</span>;
    if (typeof value === "string") return <span className="text-emerald-700 dark:text-emerald-300">"{value}"</span>;
    if (typeof value === "number") return <span className="text-sky-700 dark:text-sky-300">{value}</span>;
    if (typeof value === "boolean") return <span className="text-violet-700 dark:text-violet-300">{String(value)}</span>;
    if (Array.isArray(value)) return <span className="text-zinc-500">[]</span>;
    return <span className="text-zinc-500">{"{…}"}</span>;
  })();

  if (!isArray && !isObject) {
    return (
      <div className="flex min-w-0 items-baseline gap-2 font-mono text-xs leading-5">
        {name != null ? (
          <>
            <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{label}</span>
            <span className="shrink-0 text-zinc-400">:</span>
          </>
        ) : null}
        <span className="min-w-0 break-words">{summaryValue}</span>
      </div>
    );
  }

  const entries: Array<[string, JsonValue]> = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v])
    : Object.entries(value as { [k: string]: JsonValue });

  return (
    <details open={defaultOpen} className="group rounded-md">
      <summary className="cursor-pointer select-none rounded-md px-1 py-0.5 font-mono text-xs leading-5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50">
        <span className="mr-2 text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="mr-2 text-zinc-400">:</span>
        {summaryValue}
      </summary>
      <div className="mt-1 space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-800">
        {entries.length === 0 ? (
          <div className="font-mono text-xs text-zinc-500">{isArray ? "(empty array)" : "(empty object)"}</div>
        ) : (
          entries.map(([k, v]) =>
            isArray ? (
              <div
                key={`${depth}-${k}`}
                className="rounded-md px-1 py-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
              >
                {isJsonContainer(v) ? (
                  <JsonTree value={v} defaultOpen={depth < 1} depth={depth + 1} />
                ) : (
                  <div className="font-mono text-xs leading-5">
                    <JsonScalar value={v} />
                  </div>
                )}
              </div>
            ) : (
              isJsonContainer(v) ? (
                <div
                  key={`${depth}-${k}`}
                  className="grid grid-cols-[auto,1fr] gap-2 rounded-md px-1 py-0.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                >
                  <div className="min-w-0 max-w-56 truncate pr-1 font-mono text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {k}
                  </div>
                  <div className="min-w-0">
                    <JsonTree value={v} defaultOpen={depth < 1} depth={depth + 1} />
                  </div>
                </div>
              ) : (
                <div
                  key={`${depth}-${k}`}
                  className="flex min-w-0 items-baseline gap-2 rounded-md px-1 py-0.5 font-mono text-xs leading-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                >
                  <span className="min-w-0 max-w-56 truncate pr-1 text-zinc-500 dark:text-zinc-400">{k}</span>
                  <span className="shrink-0 text-zinc-400">:</span>
                  <span className="min-w-0 break-words">
                    <JsonScalar value={v} />
                  </span>
                </div>
              )
            ),
          )
        )}
      </div>
    </details>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-md px-2 text-xs font-medium transition",
        active
          ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
          : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
      )}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [url, setUrl] = useState("");
  const [headerLines, setHeaderLines] = useState("");
  const [body, setBody] = useState("");
  const [requestTab, setRequestTab] = useState<"headers" | "body">("headers");
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");

  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<ProxyResponse | null>(null);

  const headersObj = useMemo(() => parseHeaderLines(headerLines), [headerLines]);

  async function send() {
    setIsSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url,
          method,
          headers: headersObj,
          body,
        }),
      });
      const json = (await res.json()) as ProxyResponse;
      setResult(json);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Request failed.";
      setResult({ error: message });
    } finally {
      setIsSending(false);
    }
  }

  const normalized =
    isSuccessResponse(result)
      ? {
        ...result,
        response: {
          ...result.response,
          bodyTextPretty: prettyMaybeJson(result.response.bodyText, result.response.contentType),
        },
      }
      : null;

  const parsedJson = useMemo(
    () => (normalized ? tryParseJson(normalized.response.bodyText, normalized.response.contentType) : null),
    [normalized],
  );

  const statusPill = isSuccessResponse(result) ? (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 font-medium ring-1",
          result.ok
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
            : "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
        )}
      >
        {result.status} {result.statusText}
      </span>
      <span className="inline-flex items-center rounded-full bg-zinc-50 px-2.5 py-1 font-medium text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-300 dark:ring-zinc-800">
        {result.durationMs}ms
      </span>
      <span className="inline-flex items-center rounded-full bg-zinc-50 px-2.5 py-1 font-medium text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-300 dark:ring-zinc-800">
        {result.response.bytes} bytes
        {result.response.truncated ? <span className="ml-1 text-amber-600 dark:text-amber-400">(truncated)</span> : null}
      </span>
    </div>
  ) : result && "error" in result ? (
    <div className="text-sm font-medium text-red-600 dark:text-red-400">{result.error}</div>
  ) : (
    <div className="text-sm text-zinc-500">Send a request to see the response.</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-950 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
              bc
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold tracking-tight">blunder client</div>
              <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">Minimal API client</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Request */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="border-b border-zinc-200/70 p-4 dark:border-zinc-800/80">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Request</h2>
                <button
                  type="button"
                  onClick={send}
                  disabled={isSending || !url.trim()}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-white shadow-sm transition",
                    "bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900",
                    "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:disabled:hover:bg-zinc-100",
                  )}
                >
                  {isSending ? "Sending…" : "Send"}
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Method</span>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])}
                    className="h-10 w-32 rounded-lg border border-zinc-200 bg-white px-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-700"
                  >
                    {METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-1 flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">URL</span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/v1/health"
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-700"
                  />
                </label>
              </div>

              <div className="mt-3 inline-flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
                <TabButton active={requestTab === "headers"} onClick={() => setRequestTab("headers")}>
                  Headers
                </TabButton>
                <TabButton active={requestTab === "body"} onClick={() => setRequestTab("body")}>
                  Body
                </TabButton>
              </div>
            </div>

            <div className="p-4">
              {requestTab === "headers" ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-zinc-500">
                    One per line: <span className="font-mono">Key: Value</span>
                  </div>
                  <textarea
                    value={headerLines}
                    onChange={(e) => setHeaderLines(e.target.value)}
                    rows={14}
                    placeholder={"accept: application/json\nauthorization: Bearer …"}
                    className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 shadow-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-700"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-zinc-500">
                    Ignored for <span className="font-mono">GET</span>/<span className="font-mono">HEAD</span>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={14}
                    placeholder={'{"hello":"world"}'}
                    className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 shadow-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-700"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Response */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="border-b border-zinc-200/70 p-4 dark:border-zinc-800/80">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Response</h2>
                  <div className="mt-1">{statusPill}</div>
                </div>
                <div className="inline-flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
                  <TabButton active={responseTab === "body"} onClick={() => setResponseTab("body")}>
                    Body
                  </TabButton>
                  <TabButton active={responseTab === "headers"} onClick={() => setResponseTab("headers")}>
                    Headers
                  </TabButton>
                </div>
              </div>
              {normalized?.response.contentType ? (
                <div className="mt-2 truncate text-xs text-zinc-500">{normalized.response.contentType}</div>
              ) : null}
            </div>

            <div className="p-4">
              {responseTab === "headers" ? (
                normalized ? (
                  <div className="max-h-[32rem] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                    <table className="w-full border-separate border-spacing-y-1 text-xs">
                      <tbody>
                        {Object.entries(normalized.response.headers).map(([k, v]) => (
                          <tr key={k} className="align-top">
                            <td className="w-56 truncate pr-3 font-mono text-zinc-600 dark:text-zinc-300">{k}</td>
                            <td className="font-mono text-zinc-900 dark:text-zinc-50">{v}</td>
                          </tr>
                        ))}
                        {Object.keys(normalized.response.headers).length === 0 ? (
                          <tr>
                            <td className="text-zinc-500" colSpan={2}>
                              (no headers)
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                ) : result && "error" in result ? (
                  <div className="text-sm text-red-600 dark:text-red-400">{result.error}</div>
                ) : (
                  <div className="text-sm text-zinc-500">Send a request to see headers.</div>
                )
              ) : normalized ? (
                parsedJson != null ? (
                  <div className="max-h-[32rem] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                    <JsonTree value={parsedJson} name="root" defaultOpen />
                  </div>
                ) : normalized.response.bodyTextPretty != null ? (
                  <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-5 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-50">
                    {normalized.response.bodyTextPretty}
                  </pre>
                ) : (
                  <div className="text-sm text-zinc-500">
                    Non-text response. Body provided as base64 (first ~1MB):
                    <pre className="mt-2 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-5 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-50">
                      {normalized.response.bodyBase64 ?? ""}
                    </pre>
                  </div>
                )
              ) : result && "error" in result ? (
                <div className="text-sm text-red-600 dark:text-red-400">{result.error}</div>
              ) : (
                <div className="text-sm text-zinc-500">Send a request to see the body.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
