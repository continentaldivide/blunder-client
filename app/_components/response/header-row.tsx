export interface ResponseHeader {
  key: string;
  value: string;
}

interface HeaderRowProps {
  header: ResponseHeader;
}

export function HeaderRow({ header }: HeaderRowProps) {
  return (
    <tr className="border-b border-zinc-800 last:border-0">
      <td className="py-2 pr-4 text-xs font-medium text-zinc-300 align-top w-2/5">
        {header.key}
      </td>
      <td className="py-2 text-xs text-zinc-400 break-all">
        {header.value}
      </td>
    </tr>
  );
}
