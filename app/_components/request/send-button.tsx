"use client";

import { Button } from "../ui/button";

interface SendButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SendButton({ loading, disabled, onClick }: SendButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="send"
      className="rounded-full px-4 py-1.5 text-xs"
    >
      {loading ? "Sending..." : "Send"}
    </Button>
  );
}
