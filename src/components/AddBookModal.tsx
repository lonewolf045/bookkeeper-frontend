"use client";

import { useState } from "react";
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
  const [read, setRead] = useState<"Read" | "Not Read">("Read");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!title || !author || !pages) { setError("Fill all details"); return; }
    if (!user) { setError("You must be logged in"); return; }
    try {
      const book = await addBook(user, { title, author, pages: parseInt(pages), read });
      onAdded(book);
      onClose();
    } catch {
      setError("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>New Book</h2>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        <label>Author</label>
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
        <label>Pages</label>
        <input type="number" value={pages} onChange={e => setPages(e.target.value)} />
        <div className="radio-group">
          <b>Have you read it?</b>
          <label><input type="radio" checked={read === "Read"} onChange={() => setRead("Read")} /> Yes</label>
          <label><input type="radio" checked={read === "Not Read"} onChange={() => setRead("Not Read")} /> No</label>
        </div>
        <button className="btn-primary" onClick={handleAdd}>Add Book</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
