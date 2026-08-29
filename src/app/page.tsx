"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Book, fetchBooks } from "@/lib/api";
import LoginModal from "@/components/LoginModal";
import SignUpModal from "@/components/SignUpModal";
import AddBookModal from "@/components/AddBookModal";
import UpdateProfileModal from "@/components/UpdateProfileModal";
import UpdatePasswordModal from "@/components/UpdatePasswordModal";
import BookCard from "@/components/BookCard";

type Modal = "login" | "signup" | "addBook" | "updateProfile" | "updatePassword" | null;

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const [modal, setModal] = useState<Modal>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  const loadBooks = useCallback(async () => {
    if (!user) return;
    setBooksLoading(true);
    try {
      const data = await fetchBooks(user);
      setBooks(data);
    } catch (e) {
      console.error("Failed to load books", e);
    } finally {
      setBooksLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadBooks();
    else setBooks([]);
  }, [user, loadBooks]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", fontSize: "1.2rem" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <header id="heading-container">
        <div id="head">
          <h1 id="heading">Library</h1>
          <p id="heading-caption">Ultimate Book Repository</p>
          {user && (
            <p className="welcome-message">Welcome, {user.displayName ?? user.email}</p>
          )}
        </div>
      </header>

      {/* ── Nav buttons ── */}
      <div className="nav-buttons">
        {!user ? (
          <>
            <button className="nav-btn nav-btn-login"  onClick={() => setModal("login")}>Login</button>
            <button className="nav-btn nav-btn-signup" onClick={() => setModal("signup")}>Sign Up</button>
          </>
        ) : (
          <button className="nav-btn nav-btn-logout" onClick={logout}>Logout</button>
        )}
      </div>

      {/* ── Sidebar toggle ── */}
      {user && (
        <button className="openbtn" onClick={() => setSidebarOpen(o => !o)}>&#9776;</button>
      )}

      {/* ── Sidebar ── */}
      <nav className={`sidepanel ${sidebarOpen ? "open" : ""}`}>
        <button onClick={() => { setModal("addBook"); setSidebarOpen(false); }}>Add New Book</button>
        <button onClick={() => { setModal("updateProfile"); setSidebarOpen(false); }}>Update Profile</button>
        <button onClick={() => { setModal("updatePassword"); setSidebarOpen(false); }}>Update Password</button>
      </nav>

      {/* ── Book grid ── */}
      <main>
        <div id="container">
          {!user && (
            <p style={{ color: "#666", padding: "20px" }}>Please log in to view your library.</p>
          )}
          {user && booksLoading && (
            <p style={{ color: "#666", padding: "20px" }}>Loading your books…</p>
          )}
          {user && !booksLoading && books.length === 0 && (
            <p style={{ color: "#666", padding: "20px" }}>No books yet. Add your first one!</p>
          )}
          {user && !booksLoading && books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onUpdated={updated => setBooks(prev => prev.map(b => b.id === updated.id ? updated : b))}
              onDeleted={id => setBooks(prev => prev.filter(b => b.id !== id))}
            />
          ))}
        </div>
      </main>

      {/* ── Modals ── */}
      {modal === "login"          && <LoginModal           onClose={() => setModal(null)} />}
      {modal === "signup"         && <SignUpModal           onClose={() => setModal(null)} />}
      {modal === "addBook"        && (
        <AddBookModal
          onClose={() => setModal(null)}
          onAdded={book => setBooks(prev => [...prev, book])}
        />
      )}
      {modal === "updateProfile"  && <UpdateProfileModal   onClose={() => setModal(null)} />}
      {modal === "updatePassword" && <UpdatePasswordModal  onClose={() => setModal(null)} />}
    </>
  );
}
