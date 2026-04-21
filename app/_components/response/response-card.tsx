"use client";

import { type ProxyResponse } from "../../lib/types";
import { EmptyState } from "./empty-state";
import { ResponseMeta } from "./response-meta";
import { ResponseTabs } from "./response-tabs";
import { StatusBadge } from "./status-badge";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ResponseCardProps {
  response: ProxyResponse | null;
}

export function ResponseCard({ response }: ResponseCardProps) {
  if (!response) {
    return (
      <section className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <StatusBadge status={response.status} />
        <ResponseMeta
          duration={`${response.duration}ms`}
          size={formatSize(response.size)}
        />
      </div>
      <ResponseTabs response={response} />
    </section>
  );
}
