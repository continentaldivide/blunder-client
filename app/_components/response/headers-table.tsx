import { HeaderRow, type ResponseHeader } from "./header-row";

// Mock data — will be replaced in Commit 18 when wired to real responses
const MOCK_HEADERS: ResponseHeader[] = [
  { key: "content-type", value: "application/json; charset=utf-8" },
  { key: "content-length", value: "1234" },
  { key: "cache-control", value: "no-cache, no-store, must-revalidate" },
  { key: "x-request-id", value: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
];

export function HeadersTable() {
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
        {MOCK_HEADERS.map((header) => (
          <HeaderRow key={header.key} header={header} />
        ))}
      </tbody>
    </table>
  );
}
