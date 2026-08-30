"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Book, updateBook, deleteBook } from "@/lib/api";

interface Props {
  book: Book;
  onUpdated: (book: Book) => void;
  onDeleted: (id: number) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

export default function BookCard({ book, onUpdated, onDeleted, onToast }: Props) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [pages, setPages] = useState(String(book.pages));
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleRead = async () => {
    if (!user) return;
    try {
      const updated = await updateBook(user, book.id, {
        read: book.read === "Read" ? "Not Read" : "Read",
      });
      onUpdated(updated);
      onToast(`Marked as ${updated.read}`);
    } catch {
      onToast("Failed to update", "error");
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await updateBook(user, book.id, { title, author, pages: parseInt(pages) });
      onUpdated(updated);
      setEditing(false);
      onToast("Book updated");
    } catch {
      onToast("Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteBook(user, book.id);
      onDeleted(book.id);
      onToast("Book deleted");
    } catch {
      onToast("Failed to delete", "error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--bg-base)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.8125rem",
    color: "var(--text-primary)",
    outline: "none",
  };

  // ── Edit mode ──
  if (editing) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
        <input type="number" style={inputStyle} value={pages} onChange={e => setPages(e.target.value)} placeholder="Pages" />
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50 transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-lg py-2 text-xs font-semibold transition-colors"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Delete confirm ──
  if (confirmDelete) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
          Remove <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{book.title}</span>?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="flex-1 rounded-lg py-2 text-xs font-semibold transition-colors"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Keep
          </button>
        </div>
      </div>
    );
  }

  // ── Default card ──
  const isRead = book.read === "Read";

  return (
    <div
      className="group rounded-2xl p-4 flex flex-col gap-3 shadow-lg transition-all duration-200"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-card-hover)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-card)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Read badge */}
      <button
        onClick={toggleRead}
        className="self-start inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors"
        style={
          isRead
            ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80" }
            : { backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }
        }
        title="Toggle read status"
      >
        <span>{isRead ? "✓" : "○"}</span>
        {book.read}
      </button>

      {/* Book info */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
          {book.title}
        </h3>
        <p className="text-xs mt-1 line-clamp-1" style={{ color: "var(--text-secondary)" }}>
          {book.author}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {book.pages.toLocaleString()} pp.
        </p>
      </div>

      {/* Hover actions */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => setEditing(true)}
          className="flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors"
          style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.backgroundColor = "var(--bg-card-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "var(--bg-card)"; }}
        >
          Edit
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex-1 py-1.5 text-[11px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/25 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
