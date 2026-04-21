"use client";

import { AuthBasic } from "./auth-basic";
import { AuthBearer } from "./auth-bearer";
import { AuthSelector, type AuthType } from "./auth-selector";

interface AuthSectionProps {
  authType: AuthType;
  onAuthTypeChange: (authType: AuthType) => void;
  token: string;
  onTokenChange: (token: string) => void;
  username: string;
  onUsernameChange: (username: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
}

export function AuthSection({
  authType,
  onAuthTypeChange,
  token,
  onTokenChange,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
}: AuthSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <AuthSelector value={authType} onChange={onAuthTypeChange} />
      {authType === "bearer" && (
        <AuthBearer token={token} onChange={onTokenChange} />
      )}
      {authType === "basic" && (
        <AuthBasic
          username={username}
          password={password}
          onUsernameChange={onUsernameChange}
          onPasswordChange={onPasswordChange}
        />
      )}
    </div>
  );
}
