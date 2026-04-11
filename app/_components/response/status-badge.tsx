interface StatusBadgeProps {
  status: number;
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "bg-green-900 text-green-300";
  if (status >= 300 && status < 400) return "bg-blue-900 text-blue-300";
  if (status >= 400 && status < 500) return "bg-yellow-900 text-yellow-300";
  if (status >= 500) return "bg-red-900 text-red-300";
  return "bg-zinc-800 text-zinc-400";
}

function getStatusText(status: number): string {
  const texts: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };
  return texts[status] ?? "Unknown";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(status)}`}
    >
      {status} {getStatusText(status)}
    </span>
  );
}
