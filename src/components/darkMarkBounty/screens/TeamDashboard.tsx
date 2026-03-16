import React from "react";
import type { Team } from "@/types/darkMarkBounty";

interface Props {
  team: Team;
  codeInput: string;
  setCodeInput: (value: string) => void;
  codeError: string;
  onSubmitCode: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
  hasActiveGame: boolean;
  onResumeGame: () => void;
}

export const TeamDashboard: React.FC<Props> = ({
  team,
  codeInput,
  setCodeInput,
  codeError,
  onSubmitCode,
  onLeaderboard,
  onLogout,
  hasActiveGame,
  onResumeGame,
}) => {
  return (
    <div className="screen team-screen">
      <div className="team-header">
        <div>
          <div className="team-name-lg">{team.name}</div>
          <div className="team-players">{team.players.join(" · ")}</div>
        </div>
        <div className="team-score-lg">
          {team.score}
          <span>pts</span>
        </div>
      </div>

      <div className="code-entry-section">
        <h3>Enter Envelope Code</h3>
        <div className="code-row">
          <input
            className="input code-input"
            placeholder="e.g. HARRY"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && onSubmitCode()}
          />
          <button className="btn btn-primary" onClick={onSubmitCode}>
            🎯 Go
          </button>
        </div>
        {codeError && <div className="error-msg">{codeError}</div>}
      </div>

      {team.solved.length > 0 && (
        <div className="solved-section">
          <h3>Completed Bounties</h3>
          <div className="solved-list">
            {team.solved.map((s, i) => (
              <div key={i} className="solved-item">
                <span className="solved-code">{s.code}</span>
                <span className="solved-game">{s.game}</span>
                <span className="solved-pts">+{s.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="team-actions">
        {hasActiveGame && (
          <button className="btn btn-primary" onClick={onResumeGame} style={{ backgroundColor: '#ff9900' }}>
            ⚡ Resume Active Game
          </button>
        )}
        <button className="btn btn-ghost" onClick={onLeaderboard}>
          📊 Leaderboard
        </button>
      </div>
    </div>
  );
};
