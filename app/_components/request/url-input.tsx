"use client";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function UrlInput({ value, onChange }: UrlInputProps) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-xs font-medium text-zinc-400">URL</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://oops.com/api/endpoint"
        className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
      />
    </label>
  );
}
