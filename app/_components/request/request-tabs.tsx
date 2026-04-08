"use client";

import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";
import { AuthSection } from "./auth-section";
import { BodyEditor } from "./body-editor";
import { HeadersEditor } from "./headers-editor";

const REQUEST_TABS: TabItem[] = [
  { id: "headers", label: "Headers" },
  { id: "body", label: "Body" },
  { id: "auth", label: "Auth" },
];

export function RequestTabs() {
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
          <HeadersEditor />
        </TabPanel>
        <TabPanel id="body" activeId={activeTab}>
          <BodyEditor />
        </TabPanel>
        <TabPanel id="auth" activeId={activeTab}>
          <AuthSection />
        </TabPanel>
      </div>
    </div>
  );
}
