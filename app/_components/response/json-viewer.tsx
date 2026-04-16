"use client";

import { useState } from "react";

// ---- Types ----

type JsonRow =
  | { type: "open"; key: string | null; path: string; bracket: string; depth: number }
  | { type: "leaf"; key: string | null; path: string; value: unknown; expandable: boolean; depth: number }
  | { type: "close"; path: string; bracket: string; depth: number };

// ---- Helpers ----

function isCollection(value: unknown): boolean {
  return Array.isArray(value) || (value !== null && typeof value === "object");
}

function toEntries(value: unknown): [string, unknown][] {
  if (Array.isArray(value))
    return (value as unknown[]).map((v, i) => [String(i), v]);
  return Object.entries(value as Record<string, unknown>);
}

function collectionPreview(value: unknown): string {
  if (Array.isArray(value)) return `[${value.length}]`;
  if (value !== null && typeof value === "object")
    return `{${Object.keys(value as object).length}}`;
  return "";
}

// Walks the JSON tree and produces a flat list of renderable rows,
// skipping children of any path present in `collapsed`.
function flattenTree(
  value: unknown,
  key: string | null,
  path: string,
  depth: number,
  collapsed: Set<string>
): JsonRow[] {
  if (!isCollection(value)) {
    return [{ type: "leaf", key, path, value, expandable: false, depth }];
  }

  const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];

  if (collapsed.has(path)) {
    return [{ type: "leaf", key, path, value, expandable: true, depth }];
  }

  const rows: JsonRow[] = [{ type: "open", key, path, bracket: open, depth }];
  for (const [k, v] of toEntries(value)) {
    rows.push(...flattenTree(v, k, `${path}.${k}`, depth + 1, collapsed));
  }
  rows.push({ type: "close", path, bracket: close, depth });
  return rows;
}

// ---- Primitive renderer ----

function JsonPrimitive({ value }: { value: unknown }) {
  if (value === null) return <span className="text-zinc-500">null</span>;
  if (typeof value === "boolean")
    return <span className="text-blue-400">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="text-yellow-300">{String(value)}</span>;
  if (typeof value === "string")
    return <span className="text-green-400">&quot;{value}&quot;</span>;
  return <span>{String(value)}</span>;
}

// ---- Toggle button ----

interface ToggleButtonProps {
  path: string;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
}

function ToggleButton({ path, collapsed, onToggle }: ToggleButtonProps) {
  return (
    <button
      onClick={() => onToggle(path)}
      className="w-3 text-[9px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded cursor-pointer focus:outline-none"
      aria-label={collapsed.has(path) ? "Expand" : "Collapse"}
    >
      {collapsed.has(path) ? "▶" : "▼"}
    </button>
  );
}

// ---- Row renderer ----

interface JsonRowProps {
  row: JsonRow;
  lineNumber: number;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
}

function JsonRowView({ row, lineNumber, collapsed, onToggle }: JsonRowProps) {
  const hasButton =
    row.type === "open" ||
    (row.type === "leaf" && row.expandable);

  return (
    <div className="flex items-baseline leading-6">
      {/* Line number */}
      <span className="w-8 flex-none select-none pr-3 text-right text-zinc-600">
        {lineNumber}
      </span>
      {/* Toggle button — fixed column, always left-aligned */}
      <span className="w-3 flex-none">
        {hasButton && (
          <ToggleButton path={row.path} collapsed={collapsed} onToggle={onToggle} />
        )}
      </span>
      {/* Depth indentation */}
      <span className="flex-none" style={{ width: row.depth * 12 }} />
      {/* Row content */}
      {row.type === "open" && (
        <>
          {row.key !== null && (
            <span className="text-zinc-400">{row.key}: </span>
          )}
          <span className="text-zinc-500">{row.bracket}</span>
        </>
      )}
      {row.type === "leaf" && (
        <>
          {row.key !== null && (
            <span className="text-zinc-400">{row.key}: </span>
          )}
          {row.expandable ? (
            <span className="text-zinc-500">{collectionPreview(row.value)}</span>
          ) : (
            <JsonPrimitive value={row.value} />
          )}
        </>
      )}
      {row.type === "close" && (
        <span className="text-zinc-500">{row.bracket}</span>
      )}
    </div>
  );
}

// ---- Public component ----

interface JsonViewerProps {
  value: unknown;
}

export function JsonViewer({ value }: JsonViewerProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function handleToggle(path: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  // Flatten fully expanded to assign each row a stable line number by path+type.
  const allRows = flattenTree(value, null, "root", 0, new Set());
  const lineNumbers = new Map(
    allRows.map((row, i) => [`${row.path}.${row.type}`, i + 1])
  );

  // Flatten with actual collapsed state for what's visible.
  const rows = flattenTree(value, null, "root", 0, collapsed);

  return (
    <div className="overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-sm">
      {rows.map((row, i) => (
        <JsonRowView
          key={i}
          row={row}
          lineNumber={lineNumbers.get(`${row.path}.${row.type}`) ?? i + 1}
          collapsed={collapsed}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
