"use client";

import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";
import { AuthSection } from "./auth-section";
import { BodyEditor } from "./body-editor";
import { HeadersEditor } from "./headers-editor";
import { type Header } from "./header-row";
import { type ContentType } from "./content-type-selector";
import { type AuthType } from "./auth-selector";

const REQUEST_TABS: TabItem[] = [
  { id: "headers", label: "Headers" },
  { id: "body", label: "Body" },
  { id: "auth", label: "Auth" },
];

interface RequestTabsProps {
  headers: Header[];
  onHeadersChange: (headers: Header[]) => void;
  contentType: ContentType;
  onContentTypeChange: (contentType: ContentType) => void;
  body: string;
  onBodyChange: (body: string) => void;
  authType: AuthType;
  onAuthTypeChange: (authType: AuthType) => void;
  token: string;
  onTokenChange: (token: string) => void;
  username: string;
  onUsernameChange: (username: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
}

export function RequestTabs({
  headers,
  onHeadersChange,
  contentType,
  onContentTypeChange,
  body,
  onBodyChange,
  authType,
  onAuthTypeChange,
  token,
  onTokenChange,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
}: RequestTabsProps) {
  const [activeTab, setActiveTab] = useState("headers");

  return (
    <div className="mt-4">
      <TabList
        items={REQUEST_TABS}
        activeId={activeTab}
        onActiveIdChange={setActiveTab}
      />
      <div className="mt-3 min-h-20">
        <TabPanel id="headers" activeId={activeTab}>
          <HeadersEditor headers={headers} onChange={onHeadersChange} />
        </TabPanel>
        <TabPanel id="body" activeId={activeTab}>
          <BodyEditor
            contentType={contentType}
            onContentTypeChange={onContentTypeChange}
            body={body}
            onBodyChange={onBodyChange}
          />
        </TabPanel>
        <TabPanel id="auth" activeId={activeTab}>
          <AuthSection
            authType={authType}
            onAuthTypeChange={onAuthTypeChange}
            token={token}
            onTokenChange={onTokenChange}
            username={username}
            onUsernameChange={onUsernameChange}
            password={password}
            onPasswordChange={onPasswordChange}
          />
        </TabPanel>
      </div>
    </div>
  );
}
