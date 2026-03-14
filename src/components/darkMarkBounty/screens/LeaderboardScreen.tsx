import React from "react";
import type { Team } from "../../../types/darkMarkBounty";

interface Props {
  teams: Team[];
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<Props> = ({ teams, onBack }) => {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="screen leaderboard-screen">
      <div className="lb-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>⚔️ Live Leaderboard</h1>
      </div>
      <div className="lb-list">
        {teams.map((team, i) => (
          <div key={team.id} className={`lb-row ${i === 0 ? "lb-first" : ""}`}>
            <div className="lb-rank">{medals[i] || `#${i + 1}`}</div>
            <div className="lb-team">
              <div className="lb-name">{team.name}</div>
              <div className="lb-detail">
                {team.solved.length} bounties solved · {team.players.join(", ")}
              </div>
            </div>
            <div className="lb-score">{team.score}</div>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="lb-empty">No teams yet. The hunt begins soon...</div>
        )}
      </div>
    </div>
  );
};
