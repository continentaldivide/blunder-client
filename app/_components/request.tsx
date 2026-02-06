"use client";

import { useState } from "react";

export function Request() {
    const [url, setUrl] = useState("");
    return (
        <div className="bg-zinc-900 p-4 rounded-lg">
            <label className="flex flex-1 flex-col gap-1">
                <span className="text-xs font-medium text-zinc-400">URL</span>
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://oops.com/api/endpoint"
                    className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-zinc-700"
                />
            </label>
        </div>
    )
}