"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function SignUpModal({ onClose }: Props) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!displayName || !email || !password) { setError("Fill all details"); return; }
    try {
      await signUp(email, password, displayName);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <label>Display Name</label>
        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary" onClick={handleSignUp}>Sign Up</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
