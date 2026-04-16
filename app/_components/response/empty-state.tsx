export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-sm font-medium text-zinc-400">No response yet</p>
      <p className="text-xs text-zinc-600">Send a request to see the response here</p>
    </div>
  );
}
