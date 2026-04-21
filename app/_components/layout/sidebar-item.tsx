interface SidebarItemProps {
  label: string;
  count?: number;
}

export function SidebarItem({ label, count }: SidebarItemProps) {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs text-zinc-600">{count}</span>
      )}
    </div>
  );
}
