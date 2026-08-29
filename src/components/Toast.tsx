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
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      {message}
    </div>
  );
}
