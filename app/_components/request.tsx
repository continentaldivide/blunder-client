"use client";

import { useState } from "react";
import { MethodSelector, type HttpMethod } from "./request/method-selector";
import { RequestTabs } from "./request/request-tabs";
import { SendButton } from "./request/send-button";
import { UrlInput } from "./request/url-input";

export function Request() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <MethodSelector value={method} onChange={setMethod} />
        <UrlInput value={url} onChange={setUrl} action={<SendButton />} />
      </div>

      <RequestTabs />
    </section>
  );
}