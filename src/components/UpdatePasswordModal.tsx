"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function UpdatePasswordModal({ onClose }: Props) {
  const { changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!newPassword) { setError("Enter a new password"); return; }
    try {
      await changePassword(newPassword);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch {
      setError("Failed to update password. You may need to re-login.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Password</h2>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "0.85rem" }}>Password updated!</p>}
        <label>New Password</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <button className="btn-primary" onClick={handleUpdate}>Update</button>
        <button className="btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
