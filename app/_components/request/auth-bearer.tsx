"use client";

interface AuthBearerProps {
  token: string;
  onChange: (token: string) => void;
}

export function AuthBearer({ token, onChange }: AuthBearerProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-400">Token</span>
      <input
        type="password"
        value={token}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Bearer token"
        className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
      />
    </label>
  );
}
