interface MetaItemProps {
  label: string;
  value: string;
}

interface ResponseMetaProps {
  duration: string;
  size: string;
}

function MetaItem({ label, value }: MetaItemProps) {
  return (
    <span className="text-xs text-zinc-400">
      <span className="text-zinc-500">{label}:</span> {value}
    </span>
  );
}

export function ResponseMeta({ duration, size }: ResponseMetaProps) {
  return (
    <div className="flex items-center gap-4">
      <MetaItem label="Time" value={duration} />
      <MetaItem label="Size" value={size} />
    </div>
  );
}
