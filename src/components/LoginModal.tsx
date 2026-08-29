"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Fill all details"); return; }
    try {
      await login(email, password);
      onClose();
    } catch {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Login</h2>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary" onClick={handleLogin}>Login</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
