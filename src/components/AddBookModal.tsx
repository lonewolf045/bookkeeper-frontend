"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { addBook, Book } from "@/lib/api";

interface Props {
  onClose: () => void;
  onAdded: (book: Book) => void;
}

export default function AddBookModal({ onClose, onAdded }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [read, setRead] = useState<"Read" | "Not Read">("Not Read");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => { firstInput.current?.focus(); }, []);

  const handleAdd = async () => {
    if (!title || !author || !pages) { setError("Please fill in all fields"); return; }
    if (!user) { setError("You must be logged in"); return; }
    setLoading(true);
    setError("");
    try {
      const book = await addBook(user, { title, author, pages: parseInt(pages), read });
      onAdded(book);
      onClose();
    } catch {
      setError("Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--bg-base)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={e => e.key === "Escape" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="addbook-title"
        className="w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="addbook-title"
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Add a book
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lg leading-none transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.backgroundColor = "var(--border)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.backgroundColor = "transparent"; }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="text-sm rounded-xl px-4 py-3" style={{ color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Title</label>
            <input
              ref={firstInput}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Book title"
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Author</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              style={inputStyle}
              placeholder="Author name"
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Pages</label>
            <input
              type="number"
              value={pages}
              onChange={e => setPages(e.target.value)}
              style={inputStyle}
              placeholder="Number of pages"
              min="1"
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Read status toggle */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Status</span>
            <div className="grid grid-cols-2 gap-2">
              {(["Not Read", "Read"] as const).map(opt => {
                const active = read === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRead(opt)}
                    className="py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={
                      active
                        ? opt === "Read"
                          ? { backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }
                          : { backgroundColor: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24" }
                        : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }
                    }
                  >
                    {opt === "Read" ? "✓ Read" : "○ Not Read"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
        >
          {loading ? "Adding…" : "Add book"}
        </button>
      </div>
    </div>
  );
}
