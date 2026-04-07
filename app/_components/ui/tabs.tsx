"use client";

import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
}

interface TabListProps {
  items: TabItem[];
  activeId: string;
  onActiveIdChange: (id: string) => void;
  className?: string;
}

export function TabList({
  items,
  activeId,
  onActiveIdChange,
  className,
}: TabListProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`flex gap-0 border-b border-zinc-800 ${className ?? ""}`}
    >
      {items.map((item) => {
        const selected = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onActiveIdChange(item.id)}
            className={
              selected
                ? "border-zinc-50 px-3 py-2 text-sm font-medium text-zinc-50 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                : "border-transparent px-3 py-2 text-sm font-medium text-zinc-500 outline-none hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            }
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeId: string;
  children?: ReactNode;
  className?: string;
}

export function TabPanel({ id, activeId, children, className }: TabPanelProps) {
  const active = activeId === id;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      hidden={!active}
      className={className}
    >
      {children}
    </div>
  );
}
