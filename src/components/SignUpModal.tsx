"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props { onClose: () => void; }

export default function SignUpModal({ onClose }: Props) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => { firstInput.current?.focus(); }, []);

  const handleSignUp = async () => {
    if (!displayName || !email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, displayName);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign up failed. Please try again.");
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
        aria-labelledby="signup-title"
        className="w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="signup-title"
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create account
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
          {[
            { label: "Display name", type: "text", value: displayName, set: setDisplayName, ref: firstInput, placeholder: "Jane Doe" },
            { label: "Email", type: "email", value: email, set: setEmail, ref: undefined, placeholder: "jane@example.com" },
            { label: "Password", type: "password", value: password, set: setPassword, ref: undefined, placeholder: "Min. 6 characters" },
          ].map(({ label, type, value, set, ref, placeholder }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</label>
              <input
                ref={ref}
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSignUp()}
                style={inputStyle}
                placeholder={placeholder}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </div>
    </div>
  );
}
