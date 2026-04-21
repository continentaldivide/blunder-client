import { BodyFormatter } from "./body-formatter";

interface BodyViewerProps {
  body: string;
  contentType: string;
}

export function BodyViewer({ body, contentType }: BodyViewerProps) {
  return <BodyFormatter contentType={contentType} body={body} />;
}
