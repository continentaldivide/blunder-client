import { BodyFormatter } from "./body-formatter";

// Mock data — will be replaced in Commit 18 when wired to real responses
const MOCK_CONTENT_TYPE = "application/json";
const MOCK_BODY = JSON.stringify(
  {
    id: 1,
    name: "Blunder Client",
    version: "0.1.0",
    features: ["requests", "headers", "auth"],
    meta: {
      author: "you",
      stable: false,
    },
  },
  null,
  2
);

export function BodyViewer() {
  return (
    <BodyFormatter contentType={MOCK_CONTENT_TYPE} body={MOCK_BODY} />
  );
}
