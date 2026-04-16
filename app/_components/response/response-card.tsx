"use client";

import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { ResponseMeta } from "./response-meta";
import { ResponseTabs } from "./response-tabs";
import { StatusBadge } from "./status-badge";

type ResponseState = "empty" | "error" | "success";

// Mock data — will be replaced in Commit 18 when wired to real responses
const MOCK_STATE: ResponseState = "success";
const MOCK_STATUS = 200;
const MOCK_DURATION = "123ms";
const MOCK_SIZE = "1.2 KB";
const MOCK_ERROR = "Could not connect to server";

export function ResponseCard() {
  if (MOCK_STATE === "empty") {
    return (
      <section className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
        <EmptyState />
      </section>
    );
  }

  if (MOCK_STATE === "error") {
    return (
      <section className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
        <ErrorState message={MOCK_ERROR} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <StatusBadge status={MOCK_STATUS} />
        <ResponseMeta duration={MOCK_DURATION} size={MOCK_SIZE} />
      </div>
      <ResponseTabs />
    </section>
  );
}
