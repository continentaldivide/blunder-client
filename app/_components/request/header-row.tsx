"use client";

import { Button } from "../ui/button";

export interface Header {
  key: string;
  value: string;
}

interface HeaderRowProps {
  header: Header;
  onChange: (header: Header) => void;
  onRemove: () => void;
}

export function HeaderRow({ header, onChange, onRemove }: HeaderRowProps) {
  return (
    <div className="flex gap-2">
      <input
        value={header.key}
        onChange={(e) => onChange({ ...header, key: e.target.value })}
        placeholder="Key"
        className="h-9 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
      />
      <input
        value={header.value}
        onChange={(e) => onChange({ ...header, value: e.target.value })}
        placeholder="Value"
        className="h-9 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
      />
      <Button
        variant="ghost"
        onClick={onRemove}
        aria-label="Remove header"
        className="px-2"
      >
        ✕
      </Button>
    </div>
  );
}
