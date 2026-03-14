import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Team } from "@/types/darkMarkBounty";

interface Props {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<Props> = ({ onBack }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const medals = ["🥇", "🥈", "🥉"];

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("darkmark_leaderboard")
      .select("*")
      .order("score", { ascending: false });

    if (data) {
      const mappedTeams: Team[] = data.map((d: any) => ({
        id: d.user_id,
        name: d.team_name,
        players: [], // You might want to join with profiles for player names
        score: d.score,
        solved: d.solved_data || [],
        usedCodes: (d.solved_data || []).map((s: any) => s.code),
      }));
      setTeams(mappedTeams);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("darkmark_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "darkmark_leaderboard" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="screen leaderboard-screen">
      <div className="lb-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>⚔️ Live Leaderboard</h1>
      </div>
      {loading ? (
        <div className="lb-empty">Scanning for bounty data...</div>
      ) : (
        <div className="lb-list">
          {teams.map((team, i) => (
            <div key={team.id} className={`lb-row ${i === 0 ? "lb-first" : ""}`}>
              <div className="lb-rank">{medals[i] || `#${i + 1}`}</div>
              <div className="lb-team">
                <div className="lb-name">{team.name}</div>
                <div className="lb-detail">
                  {team.solved.length} bounties solved
                </div>
              </div>
              <div className="lb-score">{team.score}</div>
            </div>
          ))}
          {teams.length === 0 && (
            <div className="lb-empty">No teams yet. The hunt begins soon...</div>
          )}
        </div>
      )}
    </div>
  );
};
