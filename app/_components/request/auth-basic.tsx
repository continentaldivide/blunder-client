"use client";

interface AuthBasicProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function AuthBasic({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
}: AuthBasicProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-zinc-400">Username</span>
        <input
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Username"
          className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-zinc-400">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-700"
        />
      </label>
    </div>
  );
}
