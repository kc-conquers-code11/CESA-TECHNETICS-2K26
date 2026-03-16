import React from "react";

interface Props {
  onTeam: () => void;
  onLeader: () => void;
  onAdmin: () => void;
}

export const LandingScreen: React.FC<Props> = ({
  onTeam,
  onLeader,
  onAdmin,
}) => {
  return (
    <div className="screen landing-screen">
      <div className="landing-bg" />
      <div className="landing-content">
        <div className="dm-skull">💀</div>
        <h1 className="dm-title">
          DARK MARK
          <br />
          <span className="dm-sub">BOUNTY</span>
        </h1>
        <p className="dm-tagline">
          Pick your envelope. Crack the code. Claim the bounty.
        </p>
        <div className="landing-btns">
          <button className="btn btn-primary" onClick={onTeam}>
            Enter as Team
          </button>
          <button className="btn btn-ghost" onClick={onLeader}>
            Live Leaderboard
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onAdmin}>
            Admin Panel
          </button>
        </div>
        <div className="diff-legend">
          <span className="badge yellow">🟡 Easy — 50pts</span>
          <span className="badge orange">🟠 Medium — 100pts</span>
          <span className="badge red">🔴 Hard — 200pts</span>
        </div>
      </div>
    </div>
  );
};
