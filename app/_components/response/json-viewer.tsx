"use client";

import { useState } from "react";

// ---- Types ----

type JsonRow =
  | { type: "open"; key: string | null; quoted: boolean; path: string; bracket: string; depth: number }
  | { type: "leaf"; key: string | null; quoted: boolean; path: string; value: unknown; expandable: boolean; depth: number }
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

// Walks the JSON tree and produces a flat list of renderable rows,
// skipping children of any path present in `collapsed`.
function flattenTree(
  value: unknown,
  key: string | null,
  path: string,
  depth: number,
  collapsed: Set<string>,
  quoted: boolean = false
): JsonRow[] {
  if (!isCollection(value)) {
    return [{ type: "leaf", key, quoted, path, value, expandable: false, depth }];
  }

  const isArray = Array.isArray(value);
  const [open, close] = isArray ? ["[", "]"] : ["{", "}"];

  if (collapsed.has(path)) {
    return [{ type: "leaf", key, quoted, path, value, expandable: true, depth }];
  }

  const rows: JsonRow[] = [{ type: "open", key, quoted, path, bracket: open, depth }];
  for (const [k, v] of toEntries(value)) {
    rows.push(...flattenTree(v, k, `${path}.${k}`, depth + 1, collapsed, !isArray));
  }
  rows.push({ type: "close", path, bracket: close, depth });
  return rows;
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

// ---- Row renderer ----

interface JsonRowProps {
  row: JsonRow;
  onToggle: (path: string) => void;
}

function JsonRowView({ row, onToggle }: JsonRowProps) {
  const isClickable =
    row.type === "open" || (row.type === "leaf" && row.expandable);
  const isOpen = row.type === "open";

  // Pre-compute collapsed collection summary
  let summary: { open: string; close: string; count: number; label: string } | null = null;
  if (row.type === "leaf" && row.expandable) {
    const isArr = Array.isArray(row.value);
    const count = isArr
      ? (row.value as unknown[]).length
      : Object.keys(row.value as object).length;
    summary = {
      open: isArr ? "[" : "{",
      close: isArr ? "]" : "}",
      count,
      label: isArr ? "items" : count === 1 ? "key" : "keys",
    };
  }

  return (
    <div
      className={`relative flex min-h-[24px] items-center${isClickable ? " cursor-pointer hover:bg-white/[0.02]" : ""}`}
      style={{ paddingLeft: row.depth * 18 }}
      onClick={isClickable ? () => onToggle(row.path) : undefined}
    >
      <GuideLines depth={row.depth} />

      {/* Chevron (collection rows) or spacer (leaf/close rows) */}
      {isClickable ? (
        <span
          className="inline-flex h-4 w-4 flex-none items-center justify-center text-[9px] text-zinc-500"
          style={{
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
          }}
          aria-hidden
        >
          ▶
        </span>
      ) : (
        <span className="inline-block w-4 flex-none" />
      )}

      {/* Row content */}
      <span>
        {/* Key label (close rows never have a key) */}
        {row.type !== "close" && row.key !== null && (
          <span className="mr-1 text-zinc-400">
            {row.quoted ? `"${row.key}"` : row.key}:
          </span>
        )}

        {/* Opening bracket (expanded collection header) */}
        {row.type === "open" && (
          <span className="text-zinc-600">{row.bracket}</span>
        )}

        {/* Collapsed collection summary: { N keys } or [ N items ] */}
        {summary && (
          <>
            <span className="text-zinc-600">{summary.open}</span>
            <span className="mx-1.5 text-[11px] italic text-zinc-500">
              {summary.count} {summary.label}
            </span>
            <span className="text-zinc-600">{summary.close}</span>
          </>
        )}

        {/* Primitive value */}
        {row.type === "leaf" && !row.expandable && (
          <JsonPrimitive value={row.value} />
        )}

        {/* Closing bracket */}
        {row.type === "close" && (
          <span className="text-zinc-600">{row.bracket}</span>
        )}
      </span>
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

  const rows = flattenTree(value, null, "root", 0, collapsed);

  return (
    <div className="py-2 font-mono text-xs">
      {rows.map((row, i) => (
        <JsonRowView
          key={i}
          row={row}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
