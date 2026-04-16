interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-sm font-medium text-red-400">Request failed</p>
      <p className="text-xs text-zinc-500">{message}</p>
    </div>
  );
}
