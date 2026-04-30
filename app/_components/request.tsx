"use client";

import { useState, useEffect } from "react";
import { type ProxyResponse } from "../lib/types";
import { MethodSelector, type HttpMethod } from "./request/method-selector";
import { RequestTabs } from "./request/request-tabs";
import { SendButton } from "./request/send-button";
import { UrlInput } from "./request/url-input";
import { type Header } from "./request/header-row";
import { type ContentType } from "./request/content-type-selector";
import { type AuthType } from "./request/auth-selector";

const NO_BODY_METHODS: HttpMethod[] = ["GET", "HEAD"];

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function buildAuthHeader(
  authType: AuthType,
  token: string,
  username: string,
  password: string
): Record<string, string> {
  if (authType === "bearer" && token) {
    return { Authorization: `Bearer ${token}` };
  }
  if (authType === "basic" && username) {
    return { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
  }
  return {};
}

interface RequestProps {
  onResponse: (response: ProxyResponse) => void;
  externalUrl?: string | null;
  onExternalUrlConsumed?: () => void;
}

export function Request({ onResponse, externalUrl, onExternalUrlConsumed }: RequestProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Headers tab state
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);

  // Body tab state
  const [contentType, setContentType] = useState<ContentType>("application/json");
  const [body, setBody] = useState("");

  // Auth tab state
  const [authType, setAuthType] = useState<AuthType>("none");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function sendRequest(targetUrl: string, methodOverride?: HttpMethod) {
    if (!isValidUrl(targetUrl)) return;
    const targetMethod = methodOverride ?? method;
    setLoading(true);
    try {
      const explicitHeaders = Object.fromEntries(
        headers
          .filter((h) => h.key.trim())
          .map((h) => [h.key.trim(), h.value])
      );
      const authHeader = buildAuthHeader(authType, token, username, password);
      const allHeaders: Record<string, string> = {
        ...explicitHeaders,
        ...authHeader,
      };

      const hasBody = !NO_BODY_METHODS.includes(targetMethod) && body;
      if (hasBody) {
        allHeaders["Content-Type"] ??= contentType;
      }

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: targetMethod,
          url: targetUrl,
          headers: allHeaders,
          body: hasBody ? body : undefined,
        }),
      });

      const data: ProxyResponse = await res.json();
      onResponse(data);
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    await sendRequest(url);
  }

  useEffect(() => {
    if (!externalUrl) return;
    setUrl(externalUrl);
    if (method !== "GET") setMethod("GET");
    void sendRequest(externalUrl, "GET");
    onExternalUrlConsumed?.();
  // sendRequest is intentionally omitted — it's recreated each render but we
  // only want this effect to fire when externalUrl changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalUrl]);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      >
        <MethodSelector value={method} onChange={setMethod} />
        <UrlInput
          value={url}
          onChange={setUrl}
          action={
            <SendButton
              loading={loading}
              disabled={!isValidUrl(url) || loading}
              onClick={handleSend}
            />
          }
        />
      </form>
      <RequestTabs
        headers={headers}
        onHeadersChange={setHeaders}
        contentType={contentType}
        onContentTypeChange={setContentType}
        body={body}
        onBodyChange={setBody}
        authType={authType}
        onAuthTypeChange={setAuthType}
        token={token}
        onTokenChange={setToken}
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
      />
    </section>
  );
}
