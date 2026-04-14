import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";

const RESPONSE_TABS: TabItem[] = [
  { id: "body", label: "Body" },
  { id: "headers", label: "Headers" },
  { id: "timeline", label: "Timeline" },
];

export function ResponseTabs() {
  const [activeTab, setActiveTab] = useState("body");

  return (
    <div className="mt-4">
      <TabList
        items={RESPONSE_TABS}
        activeId={activeTab}
        onActiveIdChange={setActiveTab}
      />
      <div className="mt-3 min-h-20">
        <TabPanel id="body" activeId={activeTab}>
          {/* Commit 11: response body viewer */}
        </TabPanel>
        <TabPanel id="headers" activeId={activeTab}>
          {/* Commit 10: response headers table */}
        </TabPanel>
        <TabPanel id="timeline" activeId={activeTab}>
          {/* Future: timeline/waterfall view */}
        </TabPanel>
      </div>
    </div>
  );
}
