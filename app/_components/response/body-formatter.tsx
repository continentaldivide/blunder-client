import { JsonViewer } from "./json-viewer";

interface BodyFormatterProps {
  contentType: string;
  body: string;
}

function parseJson(body: string): unknown | null {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export function BodyFormatter({ contentType, body }: BodyFormatterProps) {
  if (contentType.includes("application/json")) {
    const parsed = parseJson(body);
    if (parsed !== null) {
      return <JsonViewer value={parsed} />;
    }
    // Fall through to text if JSON is malformed
  }

  return (
    <pre className="whitespace-pre-wrap break-all rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300 font-mono">
      {body}
    </pre>
  );
}
