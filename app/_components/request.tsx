"use client";

import { useState } from "react";
import { MethodSelector, type HttpMethod } from "./request/method-selector";
import { RequestTabs } from "./request/request-tabs";
import { UrlInput } from "./request/url-input";

export function Request() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");

  return (
    <section className="rounded-lg bg-zinc-900 p-4">
      <div className="mb-3 text-sm font-semibold text-zinc-50">Request</div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <MethodSelector value={method} onChange={setMethod} />
        <UrlInput value={url} onChange={setUrl} />
      </div>

      <RequestTabs />
    </section>
  );
}
