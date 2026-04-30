import { useState } from "react";
import { TabList, TabPanel, type TabItem } from "../ui/tabs";
import { type ProxyResponse } from "../../lib/types";
import { BodyViewer } from "./body-viewer";
import { HeadersTable } from "./headers-table";
import { type ResponseHeader } from "./header-row";

const RESPONSE_TABS: TabItem[] = [
  { id: "body", label: "Body" },
  { id: "headers", label: "Headers" },
  { id: "timeline", label: "Timeline" },
];

interface ResponseTabsProps {
  response: ProxyResponse;
}

export function ResponseTabs({ response }: ResponseTabsProps) {
  const [activeTab, setActiveTab] = useState("body");

  const contentType = response.headers["content-type"] ?? "";
  const headersList: ResponseHeader[] = Object.entries(response.headers).map(
    ([key, value]) => ({ key, value })
  );

  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col">
      <TabList
        items={RESPONSE_TABS}
        activeId={activeTab}
        onActiveIdChange={setActiveTab}
      />
      <div className="mt-3 flex-1 overflow-y-auto">
        <TabPanel id="body" activeId={activeTab}>
          <BodyViewer body={response.body} contentType={contentType} />
        </TabPanel>
        <TabPanel id="headers" activeId={activeTab}>
          <HeadersTable headers={headersList} />
        </TabPanel>
        <TabPanel id="timeline" activeId={activeTab}>
          {/* Future: timeline/waterfall view */}
        </TabPanel>
      </div>
    </div>
  );
}
