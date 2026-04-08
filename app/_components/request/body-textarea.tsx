"use client";

import { Textarea } from "../ui/textarea";

interface BodyTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function BodyTextarea({ value, onChange }: BodyTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Request body"
      rows={8}
      spellCheck={false}
    />
  );
}
