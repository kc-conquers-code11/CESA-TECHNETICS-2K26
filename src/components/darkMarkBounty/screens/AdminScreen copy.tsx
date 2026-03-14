import React, { useState } from "react";
import type { Team, Envelope } from "../../../types/darkMarkBounty";
import { GAME_NAMES } from "../../../utils/darkMarkBounty/gameHelpers";

interface Props {
  teams: Team[];
  codes: Record<string, Envelope>;
  onBack: () => void;
  onUpdateCode: (oldCode: string, newCode: string) => boolean;
  onReset: () => void;
}

type Tab = "teams" | "codes" | "details" | "stats";

export const AdminScreen: React.FC<Props> = ({
  teams,
  codes,
  onBack,
  onUpdateCode,
  onReset,
}) => {
  const [tab, setTab] = useState<Tab>("teams");
  const [editCodeId, setEditCodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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
                className={`code-chip code-${info.color} ${(usedCodes as string[]).includes(code) ? "used" : ""}`}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>
                      {editCodeId === code ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (onUpdateCode(code, editValue)) {
                                setEditCodeId(null);
                              }
                            } else if (e.key === "Escape") {
                              setEditCodeId(null);
                            }
                          }}
                          onBlur={() => setEditCodeId(null)}
                          style={{ background: '#222', color: '#fff', border: '1px solid #444', width: '80px', padding: '2px 4px' }}
                        />
                      ) : (
                        code
                      )}
                    </strong>
                    {(usedCodes as string[]).includes(code) && <span> ✓</span>}
                  </div>
                  <div style={{ fontSize: '0.7em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                    <span>{info.points}pts · {GAME_NAMES[0]}</span>
                    {!editCodeId && !(usedCodes as string[]).includes(code) && (
                      <button 
                        onClick={() => { setEditCodeId(code); setEditValue(code); }}
                        style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', padding: 0 }}
                        title="Edit Code"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "details" && (
  <div className="admin-content">
    <div className="details-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Object.entries(codes).map(([code, info]) => (
        <div key={code} className="admin-team-card">
          {/* Left Side: Code Identifier */}
          <div className="atc-rank" style={{ fontSize: '0.85rem', width: '70px', background: '#333' }}>
            {code}
          </div>

          {/* Center: Game Info */}
          <div className="atc-info">
            <strong style={{ fontSize: '1.1rem' }}>
              {GAME_NAMES[info.difficulty] || "Unknown Game"}
            </strong>
            <span style={{ opacity: 0.8 }}>
              {info.difficulty.toUpperCase()} · {info.points} Points
            </span>
          </div>

          {/* Right Side: Status Indicator */}
          <div className="atc-score">
            {(usedCodes as string[]).includes(code) ? (
              <span style={{ color: '#00ff88', fontSize: '0.75rem', fontWeight: 'bold' }}>✓ USED</span>
            ) : (
              <span style={{ color: '#aaa', fontSize: '0.75rem' }}>AVAILABLE</span>
            )}
          </div>
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
