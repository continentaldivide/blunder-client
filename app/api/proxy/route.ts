import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { method, url, headers, body } = await request.json();

    const start = Date.now();
    const res = await fetch(url, {
      method,
      headers,
      body: body ?? undefined,
    });
    const duration = Date.now() - start;

    const responseBody = await res.text();
    const size = new TextEncoder().encode(responseBody).length;

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
      body: responseBody,
      duration,
      size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
