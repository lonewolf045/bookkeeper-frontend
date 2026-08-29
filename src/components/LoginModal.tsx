"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props { onClose: () => void; }

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => { firstInput.current?.focus(); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Fill all details"); return; }
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch {
      setError("Invalid credentials. Please try again.");
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
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col gap-4"
      >
        <h2 id="login-title" className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Balsamiq Sans', cursive" }}>Login</h2>
        {error && <p role="alert" className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Email</label>
          <input
            ref={firstInput}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl py-3 font-semibold text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
