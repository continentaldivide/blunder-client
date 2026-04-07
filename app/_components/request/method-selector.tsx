"use client";

const METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export type HttpMethod = (typeof METHODS)[number];

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (value: HttpMethod) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-400">Method</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HttpMethod)}
        className="h-10 w-28 rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
      >
        {METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </label>
  );
}
