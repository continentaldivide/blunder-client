import { SidebarItem } from "./sidebar-item";

// Mock data — will be replaced when collections are implemented
const MOCK_COLLECTIONS = [
  { label: "My Collection", count: 4 },
  { label: "Auth Examples", count: 2 },
  { label: "Local Dev", count: 7 },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-52 flex-none flex-col gap-1">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Collections
      </div>
      {MOCK_COLLECTIONS.map((collection) => (
        <SidebarItem
          key={collection.label}
          label={collection.label}
          count={collection.count}
        />
      ))}
    </aside>
  );
}
