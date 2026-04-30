"use client";

import { useState } from "react";

// ---- Helpers ----

function isCollection(value: unknown): boolean {
  return Array.isArray(value) || (value !== null && typeof value === "object");
}

function toEntries(value: unknown): [string, unknown][] {
  if (Array.isArray(value))
    return (value as unknown[]).map((v, i) => [String(i), v]);
  return Object.entries(value as Record<string, unknown>);
}

// ---- Primitive renderer ----

function JsonPrimitive({ value }: { value: unknown }) {
  if (value === null)
    return <span className="italic text-zinc-500">null</span>;
  if (typeof value === "boolean")
    return <span className="text-blue-400">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="text-yellow-300">{String(value)}</span>;
  if (typeof value === "string") {
    const isUrl = /^https?:\/\//.test(value);
    return isUrl ? (
      <span className="text-blue-300 underline decoration-blue-300/30 underline-offset-[3px]">
        &quot;{value}&quot;
      </span>
    ) : (
      <span className="text-green-400">&quot;{value}&quot;</span>
    );
  }
  return <span>{String(value)}</span>;
}

// ---- Indent guide lines ----

function GuideLines({ depth }: { depth: number }) {
  if (depth === 0) return null;
  return (
    <>
      {Array.from({ length: depth }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-zinc-800"
          style={{ left: i * 18 + 12 }}
        />
      ))}
    </>
  );
}

// ---- Recursive node renderer ----

interface JsonNodeProps {
  name: string | null;
  value: unknown;
  depth: number;
  quoted: boolean;
}

function JsonNode({ name, value, depth, quoted }: JsonNodeProps) {
  const [open, setOpen] = useState(true);

  const paddingLeft = depth * 18;

  const keyEl = name !== null && (
    <span className="mr-1 text-zinc-400">
      {quoted ? `"${name}"` : name}:
    </span>
  );

  // Primitive leaf node
  if (!isCollection(value)) {
    return (
      <div
        className="relative flex min-h-[24px] items-center"
        style={{ paddingLeft }}
      >
        <GuideLines depth={depth} />
        <span className="inline-block w-4 flex-none" />
        <span>
          {keyEl}
          <JsonPrimitive value={value} />
        </span>
      </div>
    );
  }

  // Collection node (object or array)
  const isArray = Array.isArray(value);
  const entries = toEntries(value);
  const count = entries.length;
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  return (
    <div className="relative">
      {/* Header row — persists in DOM whether open or closed, so the chevron transition always fires */}
      <div
        className="relative flex min-h-[24px] cursor-pointer items-center hover:bg-white/[0.02]"
        style={{ paddingLeft }}
        onClick={() => setOpen((v) => !v)}
      >
        <GuideLines depth={depth} />
        <span
          className="inline-flex h-4 w-4 flex-none select-none items-center justify-center text-[9px] text-zinc-500"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
          }}
          aria-hidden
        >
          ▶
        </span>
        <span>
          {keyEl}
          <span className="text-zinc-600">{openBracket}</span>
          {!open && (
            <>
              <span className="mx-1.5 text-[11px] italic text-zinc-500">
                {count} {isArray ? (count === 1 ? "item" : "items") : count === 1 ? "key" : "keys"}
              </span>
              <span className="text-zinc-600">{closeBracket}</span>
            </>
          )}
        </span>
      </div>

      {/* Children — mounted/unmounted on toggle, but the header row above always stays */}
      {open && (
        <>
          {entries.map(([k, v]) => (
            <JsonNode
              key={k}
              name={k}
              value={v}
              depth={depth + 1}
              quoted={!isArray}
            />
          ))}
          <div
            className="relative flex min-h-[24px] items-center"
            style={{ paddingLeft }}
          >
            <GuideLines depth={depth} />
            <span className="inline-block w-4 flex-none" />
            <span className="text-zinc-600">{closeBracket}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ---- Public component ----

interface JsonViewerProps {
  value: unknown;
}

export function JsonViewer({ value }: JsonViewerProps) {
  return (
    <div className="py-2 font-mono text-xs">
      <JsonNode name={null} value={value} depth={0} quoted={false} />
    </div>
  );
}
