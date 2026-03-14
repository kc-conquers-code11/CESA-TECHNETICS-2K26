import React, { useState } from "react";
import type { Team } from "../../../types/darkMarkBounty";
import { ENVELOPE_CODES } from "../../../data/darkMarkBounty/envelopeCodes";
import { GAME_NAMES } from "../../../utils/darkMarkBounty/gameHelpers";

interface Props {
  teams: Team[];
  codes: Record<string, { color: string; difficulty: string; points: number }>;
  onBack: () => void;
  onReset: () => void;
}

type Tab = "teams" | "codes" | "details" | "stats";

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
        {(["teams", "codes", "details", "stats"] as Tab[]).map((t) => (
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

      {tab === "details" && (
  <div className="admin-content">
    <div className="details-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Object.entries(ENVELOPE_CODES).map(([code, info]) => {
        const solvedInfo = teams.flatMap(t => t.solved).find(s => s.code === code);
        console.log(teams.flatMap(t => t.solved))
        const gameName = solvedInfo ? GAME_NAMES[solvedInfo.game] : "Mystery Game";
        const difficultyColor = info.color === 'yellow' ? '#f1c40f' : info.color === 'orange' ? '#e67e22' : '#e74c3c';

        return (
        <div key={code} className="admin-team-card">
          <div className="atc-rank" style={{ fontSize: '1rem', width: '150px', textAlign: 'left', color: difficultyColor }}>
            {code} <br/>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{gameName}</span>
          </div>
          <div className="atc-info">
            <strong style={{ color: difficultyColor }}>
              {info.difficulty.toUpperCase()}
            </strong>
            <span>
              {info.points} Points · {info.color.charAt(0).toUpperCase() + info.color.slice(1)} Envelope
            </span>
          </div>
          <div className="atc-score">
            {usedCodes.includes(code as any) ? (
              <span style={{ color: '#00ff88', fontSize: '0.8rem' }}>COMPLETED</span>
            ) : (
              <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>AVAILABLE</span>
            )}
          </div>
        </div>
        );
      })}
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
