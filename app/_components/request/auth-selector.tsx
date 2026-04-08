"use client";

const AUTH_TYPES = ["none", "bearer", "basic"] as const;

export type AuthType = (typeof AUTH_TYPES)[number];

interface AuthSelectorProps {
  value: AuthType;
  onChange: (value: AuthType) => void;
}

const LABELS: Record<AuthType, string> = {
  none: "None",
  bearer: "Bearer Token",
  basic: "Basic Auth",
};

export function AuthSelector({ value, onChange }: AuthSelectorProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium text-zinc-400">Auth Type</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AuthType)}
        className="h-8 rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-xs outline-none focus:ring-2 focus:ring-zinc-700"
      >
        {AUTH_TYPES.map((type) => (
          <option key={type} value={type}>
            {LABELS[type]}
          </option>
        ))}
      </select>
    </label>
  );
}
