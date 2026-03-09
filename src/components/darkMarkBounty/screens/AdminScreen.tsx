import React, { useState } from "react";
import type { Team } from "../../../types/darkMarkBounty";

interface Props {
  teams: Team[];
  codes: Record<string, { color: string; difficulty: string; points: number }>;
  onBack: () => void;
  onReset: () => void;
}

type Tab = "teams" | "codes" | "stats";

export const AdminScreen: React.FC<Props> = ({
  teams,
  codes,
  onBack,
  onReset,
}) => {
  const [tab, setTab] = useState<Tab>("teams");
  const totalCodes = Object.keys(codes).length;
  const usedCodes = teams.flatMap((t) => t.usedCodes);

  return (
    <div className="screen admin-screen">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>🛡 Admin Panel</h1>
        <button className="btn btn-danger" onClick={onReset}>
          Reset All Scores
        </button>
      </div>
      <div className="admin-tabs">
        {(["teams", "codes", "stats"] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "teams" && (
        <div className="admin-content">
          {teams.map((team, i) => (
            <div key={team.id} className="admin-team-card">
              <div className="atc-rank">#{i + 1}</div>
              <div className="atc-info">
                <strong>{team.name}</strong>
                <span>{team.players.join(", ")}</span>
                <span>
                  {team.solved.length} bounties · Used codes:{" "}
                  {team.usedCodes.join(", ") || "none"}
                </span>
              </div>
              <div className="atc-score">{team.score}pts</div>
            </div>
          ))}
        </div>
      )}

      {tab === "codes" && (
        <div className="admin-content">
          <div className="codes-stats">
            <div className="stat-box">
              <div className="stat-num">{totalCodes}</div>
              <div>Total Codes</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{usedCodes.length}</div>
              <div>Used</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{totalCodes - usedCodes.length}</div>
              <div>Available</div>
            </div>
          </div>
          <div className="codes-grid">
            {Object.entries(codes).map(([code, info]) => (
              <div
                key={code}
                className={`code-chip code-${info.color} ${usedCodes.includes(code as any) ? "used" : ""}`}
              >
                {code}
                {usedCodes.includes(code as any) && <span> ✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "stats" && (
        <div className="admin-content">
          <div className="codes-stats">
            <div className="stat-box">
              <div className="stat-num">{teams.length}</div>
              <div>Teams</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">
                {teams.reduce((a, t) => a + t.solved.length, 0)}
              </div>
              <div>Bounties Solved</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">
                {teams.reduce((a, t) => a + t.score, 0)}
              </div>
              <div>Total Points</div>
            </div>
          </div>
          <div className="admin-team-card" style={{ marginTop: 16 }}>
            <strong style={{ color: "#00ff88" }}>Top Performer: </strong>
            {teams[0]?.name || "None yet"}
          </div>
        </div>
      )}
    </div>
  );
};
