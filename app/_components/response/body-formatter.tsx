import { JsonViewer } from "./json-viewer";

interface BodyFormatterProps {
  contentType: string;
  body: string;
  onUrlClick?: (url: string) => void;
}

function parseJson(body: string): unknown | null {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export function BodyFormatter({ contentType, body, onUrlClick }: BodyFormatterProps) {
  if (contentType.includes("application/json")) {
    const parsed = parseJson(body);
    if (parsed !== null) {
      return <JsonViewer value={parsed} onUrlClick={onUrlClick} />;
    }
    // Fall through to text if JSON is malformed
  }

  return (
    <pre className="whitespace-pre-wrap break-all py-2 text-xs text-zinc-300 font-mono">
      {body}
    </pre>
  );
}
