"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  type?: "success" | "error";
  onDone: () => void;
}

export default function Toast({ message, type = "success", onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold shadow-xl"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: type === "success"
          ? "1px solid rgba(34,197,94,0.3)"
          : "1px solid rgba(239,68,68,0.3)",
        color: type === "success" ? "#4ade80" : "#f87171",
      }}
    >
      <span className="text-base leading-none">{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}
