import React, { useState } from "react";

interface Props {
  onRegister: (name: string, players: string[]) => void;
  onBack: () => void;
}

export const RegisterScreen: React.FC<Props> = ({ onRegister, onBack }) => {
  const [name, setName] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    const players = [p1, p2, p3].filter(Boolean);
    onRegister(name.trim(), players);
  };

  return (
    <div className="screen center-screen">
      <div className="card">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Register Team</h2>
        <input
          className="input"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Player 1"
          value={p1}
          onChange={(e) => setP1(e.target.value)}
        />
        <input
          className="input"
          placeholder="Player 2 (optional)"
          value={p2}
          onChange={(e) => setP2(e.target.value)}
        />
        <input
          className="input"
          placeholder="Player 3 (optional)"
          value={p3}
          onChange={(e) => setP3(e.target.value)}
        />
        <button className="btn btn-primary" onClick={submit}>
          Join the Hunt
        </button>
      </div>
    </div>
  );
};
