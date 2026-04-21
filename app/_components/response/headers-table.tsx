import { HeaderRow, type ResponseHeader } from "./header-row";

interface HeadersTableProps {
  headers: ResponseHeader[];
}

export function HeadersTable({ headers }: HeadersTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-700">
          <th className="pb-2 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide w-2/5">
            Name
          </th>
          <th className="pb-2 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {headers.map((header) => (
          <HeaderRow key={header.key} header={header} />
        ))}
      </tbody>
    </table>
  );
}
