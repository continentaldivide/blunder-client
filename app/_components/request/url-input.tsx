"use client";

import type { ReactNode } from "react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  action?: ReactNode;
}

export function UrlInput({ value, onChange, action }: UrlInputProps) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-xs font-medium text-zinc-400">URL</span>
      <div className="flex h-10 items-center rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm focus-within:ring-2 focus-within:ring-zinc-700">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://oops.com/api/endpoint"
          className="h-full flex-1 bg-transparent px-3 text-sm outline-none"
        />
        {action && <div className="pr-1">{action}</div>}
      </div>
    </label>
  );
}