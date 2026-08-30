"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme, THEMES } from "@/context/ThemeContext";
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

function getInitials(user: { displayName?: string | null; email?: string | null }) {
  if (user.displayName) {
    return user.displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join("");
  }
  if (user.email) return user.email[0].toUpperCase();
  return "?";
}

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [modal, setModal] = useState<Modal>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openModal = (m: Modal) => {
    setDropdownOpen(false);
    setModal(m);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--accent) transparent transparent transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ borderBottom: "1px solid var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-base) 80%, transparent)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Bookkeeper
            </span>
            <span
              className="hidden sm:inline text-xs font-medium tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              YOUR LIBRARY
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => setModal("login")}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  Log in
                </button>
                <button
                  onClick={() => setModal("signup")}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar */}
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                  className="w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center transition-colors select-none"
                  style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
                >
                  {getInitials(user)}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {user.displayName ?? "—"}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {user.email}
                      </p>
                    </div>

                    {/* Theme picker */}
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>
                        Theme
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {[
                          { label: "Dark",  themes: THEMES.filter(t => t.dark)  },
                          { label: "Light", themes: THEMES.filter(t => !t.dark) },
                        ].map(group => (
                          <div key={group.label}>
                            <p className="text-[10px] text-slate-500 mb-1.5">{group.label}</p>
                            <div className="flex gap-2">
                              {group.themes.map(t => (
                                <button
                                  key={t.id}
                                  onClick={() => setTheme(t.id)}
                                  title={t.label}
                                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor: t.color,
                                    outline: theme === t.id ? `2px solid ${t.color}` : "2px solid transparent",
                                    outlineOffset: "2px",
                                    boxShadow: theme === t.id ? `0 0 8px ${t.color}80` : "none",
                                  }}
                                >
                                  {theme === t.id && (
                                    <span className="text-white text-[10px] font-bold leading-none drop-shadow">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-1.5">
                      <button
                        onClick={() => openModal("updateProfile")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.backgroundColor = "var(--border)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span style={{ color: "var(--accent)" }} className="w-4 text-center">✎</span>
                        Update profile
                      </button>
                      <button
                        onClick={() => openModal("updatePassword")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.backgroundColor = "var(--border)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span style={{ color: "var(--accent)" }} className="w-4 text-center text-xs">🔒</span>
                        Change password
                      </button>
                    </div>

                    {/* Sign out */}
                    <div className="py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors text-left"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        <span className="w-4 text-center">→</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Not logged in — hero CTA */}
        {!user && (
          <div className="flex flex-col items-center justify-center mt-20 gap-6 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", color: "var(--accent-hover)" }}
            >
              📚 Personal book tracker
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Your library,<br />
              <span style={{ color: "var(--accent-hover)" }}>beautifully organised.</span>
            </h2>
            <p className="max-w-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Track every book you&apos;ve read, want to read, or are reading — all in one place.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setModal("signup")}
                className="px-6 py-3 text-white font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 20px var(--accent-shadow)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              >
                Get started
              </button>
              <button
                onClick={() => setModal("login")}
                className="px-6 py-3 font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--bg-card-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--bg-card)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                Log in
              </button>
            </div>

            {/* Theme preview for logged-out users */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Theme:</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Dark",  themes: THEMES.filter(t => t.dark)  },
                  { label: "Light", themes: THEMES.filter(t => !t.dark) },
                ].map(group => (
                  <div key={group.label} className="flex items-center gap-2">
                    <span className="text-[10px] w-8 text-right" style={{ color: "var(--text-muted)" }}>{group.label}</span>
                    <div className="flex gap-2">
                      {group.themes.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          title={t.label}
                          className="w-5 h-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: t.color,
                            outline: theme === t.id ? `2px solid ${t.color}` : "2px solid transparent",
                            outlineOffset: "2px",
                          }}
                        >
                          {theme === t.id && (
                            <span className="text-white text-[9px] font-bold leading-none drop-shadow">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading books */}
        {user && booksLoading && (
          <div className="flex justify-center mt-20">
            <div className="flex items-center gap-3" style={{ color: "var(--text-secondary)" }}>
              <div
                className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--accent) transparent transparent transparent" }}
              />
              <span className="text-sm">Loading your books…</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {user && !booksLoading && books.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              📖
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>No books yet</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Start building your library — add your first book.
            </p>
            <button
              onClick={() => setModal("addBook")}
              className="mt-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 20px var(--accent-shadow)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
            >
              Add a book
            </button>
          </div>
        )}

        {/* Book grid */}
        {user && !booksLoading && books.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Your library
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {books.length} {books.length === 1 ? "book" : "books"}
                </p>
              </div>
              <button
                onClick={() => setModal("addBook")}
                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              >
                <span className="text-base leading-none">+</span>
                Add book
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
          </>
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
