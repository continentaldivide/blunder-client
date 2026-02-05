export default function Header() {
    return (
        <div className="flex min-w-0 items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-900 shadow-sm">
                bc
            </div>
            <div>
                <div className="font-semibold tracking-tight">blunder client</div>
                <div className="text-xs text-zinc-400">Minimal API client</div>
            </div>
        </div>
    )
}