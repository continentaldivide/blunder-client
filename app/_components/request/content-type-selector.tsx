"use client";

const CONTENT_TYPES = ["application/json", "text/plain", "multipart/form-data", "application/x-www-form-urlencoded"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

export function ContentTypeSelector({ value, onChange }: ContentTypeSelectorProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-zinc-400">Content Type</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ContentType)}
        className="h-8 rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs outline-none focus:ring-2 focus:ring-zinc-700"
      >
        {CONTENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </label>
  );
}
