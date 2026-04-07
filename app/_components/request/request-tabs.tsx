"use client";

import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";

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
        <TabPanel id="headers" activeId={activeTab} />
        <TabPanel id="body" activeId={activeTab} />
        <TabPanel id="auth" activeId={activeTab} />
      </div>
    </div>
  );
}
