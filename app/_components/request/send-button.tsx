"use client";

import { useState } from "react";
import { Button } from "../ui/button";

export function SendButton() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="send"
      className="rounded-full px-4 py-1.5 text-xs"
    >
      {loading ? "Sending..." : "Send"}
    </Button>
  );
}
