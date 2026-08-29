"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function UpdateProfileModal({ onClose }: Props) {
  const { user, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!displayName) { setError("Fill all details"); return; }
    try {
      await updateDisplayName(displayName);
      onClose();
    } catch {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Profile</h2>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <label>Display Name</label>
        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <button className="btn-primary" onClick={handleUpdate}>Update Profile</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
