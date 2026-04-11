import { ResponseMeta } from "./response-meta";
import { StatusBadge } from "./status-badge";

// Mock data — will be replaced in Commit 18 when wired to real responses
const MOCK_STATUS = 200;
const MOCK_DURATION = "123ms";
const MOCK_SIZE = "1.2 KB";

export function ResponseCard() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={MOCK_STATUS} />
          <ResponseMeta duration={MOCK_DURATION} size={MOCK_SIZE} />
        </div>
      </div>
    </section>
  );
}
