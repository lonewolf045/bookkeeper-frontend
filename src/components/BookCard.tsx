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

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3 w-56">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author"
        />
        <input
          type="number"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={pages}
          onChange={e => setPages(e.target.value)}
          placeholder="Pages"
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col gap-2 w-56 border border-cyan-100">
      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{book.title}</h3>
      <p className="text-gray-500 text-xs">{book.author}</p>
      <p className="text-gray-400 text-xs">{book.pages} pages</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={toggleRead}
          className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
            book.read === "Read"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          {book.read}
        </button>
        <button
          onClick={() => setEditing(true)}
          className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
