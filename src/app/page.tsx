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
import Toast from "@/components/Toast";

type Modal = "login" | "signup" | "addBook" | "updateProfile" | "updatePassword" | null;
type ToastState = { message: string; type: "success" | "error" } | null;

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const [modal, setModal] = useState<Modal>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const loadBooks = useCallback(async () => {
    if (!user) return;
    setBooksLoading(true);
    try {
      const data = await fetchBooks(user);
      setBooks(data);
    } catch {
      showToast("Failed to load books", "error");
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-cyan-700 text-lg font-semibold animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="bg-cyan-700/90 backdrop-blur-sm shadow-md py-4 text-center relative">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Balsamiq Sans', cursive" }}>
          Bookkeeper
        </h1>
        <p className="text-cyan-100 text-sm mt-1">Your personal library</p>
        {user && (
          <p className="text-amber-300 text-sm font-semibold mt-1">
            Welcome, {user.displayName ?? user.email}
          </p>
        )}
      </header>

      {/* ── Nav buttons ── */}
      <div className="fixed top-4 right-4 flex gap-2 z-40">
        {!user ? (
          <>
            <button
              onClick={() => setModal("login")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setModal("signup")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors"
            >
              Sign Up
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition-colors"
          >
            Logout
          </button>
        )}
      </div>

      {/* ── Sidebar toggle ── */}
      {user && (
        <button
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
          className="fixed top-4 left-4 z-40 bg-black/30 hover:bg-black/50 text-white rounded-xl p-2.5 text-lg transition-colors"
        >
          ☰
        </button>
      )}

      {/* ── Sidebar ── */}
      <nav
        className={`fixed left-0 top-0 h-full bg-cyan-900 z-30 pt-16 transition-all duration-300 overflow-hidden ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {[
          { label: "Add New Book", action: "addBook" },
          { label: "Update Profile", action: "updateProfile" },
          { label: "Update Password", action: "updatePassword" },
        ].map(({ label, action }) => (
          <button
            key={action}
            onClick={() => { setModal(action as Modal); setSidebarOpen(false); }}
            className="block w-full text-left px-6 py-4 text-cyan-100 hover:bg-white/10 text-sm font-medium transition-colors whitespace-nowrap"
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Book grid ── */}
      <main className="pt-6 px-6 pb-12">
        {!user && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <p className="text-gray-500 text-lg">Please log in to view your library.</p>
            <button
              onClick={() => setModal("login")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        )}

        {user && booksLoading && (
          <div className="flex justify-center mt-24">
            <p className="text-cyan-600 font-semibold animate-pulse">Loading your books…</p>
          </div>
        )}

        {user && !booksLoading && books.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <p className="text-gray-400 text-lg">No books yet.</p>
            <button
              onClick={() => setModal("addBook")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Add your first book
            </button>
          </div>
        )}

        {user && !booksLoading && books.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onUpdated={updated => setBooks(prev => prev.map(b => b.id === updated.id ? updated : b))}
                onDeleted={id => setBooks(prev => prev.filter(b => b.id !== id))}
                onToast={showToast}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {modal === "login"          && <LoginModal onClose={() => setModal(null)} />}
      {modal === "signup"         && <SignUpModal onClose={() => setModal(null)} />}
      {modal === "addBook"        && (
        <AddBookModal
          onClose={() => setModal(null)}
          onAdded={book => { setBooks(prev => [...prev, book]); showToast("Book added!"); }}
        />
      )}
      {modal === "updateProfile"  && <UpdateProfileModal onClose={() => setModal(null)} />}
      {modal === "updatePassword" && <UpdatePasswordModal onClose={() => setModal(null)} />}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}
