"use client";

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "send";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 disabled:opacity-50";
  const variants = {
    primary: "bg-zinc-700 text-zinc-50 hover:bg-zinc-600",
    ghost: "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
    send: "bg-green-700 text-white hover:bg-green-600",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
