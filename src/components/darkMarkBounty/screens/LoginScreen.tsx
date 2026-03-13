import React from "react";
import type { Team } from "@/types/darkMarkBounty";

interface Props {
  teams: Team[];
  onLogin: (id: string) => void;
  onRegister: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  teams,
  onLogin,
  onRegister,
  onBack,
}) => {
  return (
    <div className="screen center-screen">
      <div className="card">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Select Your Team</h2>
        <div className="team-list">
          {teams.map((t) => (
            <button
              key={t.id}
              className="team-select-btn"
              onClick={() => onLogin(t.id)}
            >
              <span className="team-name-big">{t.name}</span>
              <span className="team-score-sm">{t.score} pts</span>
            </button>
          ))}
        </div>
        <div className="divider">or</div>
        <button className="btn btn-primary" onClick={onRegister}>
          Register New Team
        </button>
      </div>
    </div>
  );
};
