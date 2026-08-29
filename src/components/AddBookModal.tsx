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
    if (!title || !author || !pages) { setError("Fill all details"); return; }
    if (!user) { setError("You must be logged in"); return; }
    setLoading(true);
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

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={e => e.key === "Escape" && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="addbook-title"
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col gap-4">
        <h2 id="addbook-title" className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: "'Balsamiq Sans', cursive" }}>Add Book</h2>
        {error && <p role="alert" className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Title</label>
          <input ref={firstInput} type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Author</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Pages</label>
          <input type="number" value={pages} onChange={e => setPages(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-600">Have you read it?</span>
          <div className="flex gap-4">
            {(["Read", "Not Read"] as const).map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="radio" checked={read === opt} onChange={() => setRead(opt)}
                  className="accent-cyan-600" />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <button onClick={handleAdd} disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-colors">
          {loading ? "Adding…" : "Add Book"}
        </button>
        <button onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl py-3 font-semibold text-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
