"use client";

import { useState } from "react";
import { AuthBasic } from "./auth-basic";
import { AuthBearer } from "./auth-bearer";
import { AuthSelector, type AuthType } from "./auth-selector";

export function AuthSection() {
  const [authType, setAuthType] = useState<AuthType>("none");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <AuthSelector value={authType} onChange={setAuthType} />
      {authType === "bearer" && (
        <AuthBearer token={token} onChange={setToken} />
      )}
      {authType === "basic" && (
        <AuthBasic
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
        />
      )}
    </div>
  );
}
