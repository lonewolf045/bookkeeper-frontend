"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Book, updateBook, deleteBook } from "@/lib/api";

interface Props {
  book: Book;
  onUpdated: (book: Book) => void;
  onDeleted: (id: number) => void;
}

export default function BookCard({ book, onUpdated, onDeleted }: Props) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [pages, setPages] = useState(String(book.pages));

  const toggleRead = async () => {
    if (!user) return;
    const updated = await updateBook(user, book.id, {
      read: book.read === "Read" ? "Not Read" : "Read",
    });
    onUpdated(updated);
  };

  const handleUpdate = async () => {
    if (!user) return;
    const updated = await updateBook(user, book.id, {
      title,
      author,
      pages: parseInt(pages),
    });
    onUpdated(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!user) return;
    await deleteBook(user, book.id);
    onDeleted(book.id);
  };

  if (editing) {
    return (
      <div className="book-card">
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <input value={author} onChange={e => setAuthor(e.target.value)} />
        <input type="number" value={pages} onChange={e => setPages(e.target.value)} />
        <div className="book-card-tools">
          <button className="btn-primary" onClick={handleUpdate}>Save</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="book-detail">{book.title}</div>
      <div className="book-detail">{book.author}</div>
      <div className="book-detail">{book.pages} pages</div>
      <div className="book-card-tools">
        <button
          className={book.read === "Read" ? "read" : "not-read"}
          onClick={toggleRead}
        >
          {book.read}
        </button>
        <button className="update" onClick={() => setEditing(true)}>Update</button>
        <button className="delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
