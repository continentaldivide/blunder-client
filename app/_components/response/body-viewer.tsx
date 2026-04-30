import { BodyFormatter } from "./body-formatter";

interface BodyViewerProps {
  body: string;
  contentType: string;
  onUrlClick?: (url: string) => void;
}

export function BodyViewer({ body, contentType, onUrlClick }: BodyViewerProps) {
  return <BodyFormatter contentType={contentType} body={body} onUrlClick={onUrlClick} />;
}
