"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props { onClose: () => void; }

export default function UpdatePasswordModal({ onClose }: Props) {
  const { changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => { firstInput.current?.focus(); }, []);

  const handleUpdate = async () => {
    if (!newPassword) { setError("Please enter a new password"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    try {
      await changePassword(newPassword);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setError("Failed to update. You may need to re-login.");
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
        aria-labelledby="password-title"
        className="w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <h2
            id="password-title"
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Change password
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

        {error && (
          <div role="alert" className="text-sm rounded-xl px-4 py-3" style={{ color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm rounded-xl px-4 py-3 flex items-center gap-2" style={{ color: "#4ade80", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span>✓</span> Password updated successfully!
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>New password</label>
          <input
            ref={firstInput}
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleUpdate()}
            style={inputStyle}
            placeholder="Min. 6 characters"
            onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading || success}
          className="w-full text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "var(--accent)", boxShadow: "0 4px 14px var(--accent-shadow)" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--accent)")}
        >
          {loading ? "Updating…" : success ? "Updated!" : "Update password"}
        </button>
      </div>
    </div>
  );
}
