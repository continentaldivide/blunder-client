import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";
import { BodyViewer } from "./body-viewer";
import { HeadersTable } from "./headers-table";

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
          <BodyViewer />
        </TabPanel>
        <TabPanel id="headers" activeId={activeTab}>
          <HeadersTable />
        </TabPanel>
        <TabPanel id="timeline" activeId={activeTab}>
          {/* Future: timeline/waterfall view */}
        </TabPanel>
      </div>
    </div>
  );
}
