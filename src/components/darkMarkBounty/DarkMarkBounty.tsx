import React, { useState, useEffect } from "react";
import { ENVELOPE_CODES } from "@/components/data/darkMarkBounty/envelopeCodes";
import {
  getRandomGame,
  getPuzzle,
} from "@/utils/darkMarkBounty/gameHelpers";
import { useNotification } from "@/hooks/darkMarkBounty/useNotification";
import type { Team, ActiveGame, Screen } from "@/types/darkMarkBounty";
import { INITIAL_TEAMS } from "@/utils/darkMarkBounty/constants";
import { TeamDashboard } from "./screens/TeamDashboard";
import { GameScreen } from "./screens/GameScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { AdminScreen } from "./screens/AdminScreen";
import { useCompetitionStore } from "@/store/competitionStore";
import { supabase } from "@/lib/supabaseClient";
import "./styles/darkMarkBounty.css";
import { useNavigate } from "react-router-dom";

// import { useServerTimer } from "@/hooks/useServerTimer"; // Temporarily commented out as it's missing

const ROUND_ID = "4";

export const DarkMarkBounty: React.FC = () => {
  const { teamName, email, userId } = useCompetitionStore();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("team");
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const [adminView, setAdminView] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const { notification, showNotification } = useNotification();
  
  // Auto-initialize currentTeam from global CompetitionStore
  useEffect(() => {
    if (userId) {
      const team: Team = {
        id: userId,
        name: teamName || "Test Team",
        players: [email || "Participant"],
        score: 0,
        solved: [],
        usedCodes: [],
      };
      
      // Fetch existing score from Supabase if any
      const fetchScore = async () => {
        const { data, error } = await supabase
          .from("darkmark_leaderboard")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (data) {
          team.score = data.score;
          team.solved = data.solved_data || [];
          team.usedCodes = team.solved.map((s: any) => s.code);
        }

        setTeams(prev => {
          if (prev.find(t => t.id === userId)) return prev.map(t => t.id === userId ? team : t);
          return [...prev, team];
        });
        setCurrentTeam(team);
      };

      fetchScore();
    }
  }, [teamName, email, userId]);

  // const { timerState, formattedTime } = useServerTimer(ROUND_ID);
  const timerState = { timerStatus: "running" }; // Mock
  const formattedTime = "00:00:00"; // Mock

  const handleCodeSubmit = async () => {
    if (timerState?.timerStatus !== "running") {
      setCodeError("The round is not active!");
      return;
    }

    const code = codeInput.trim().toUpperCase() as keyof typeof ENVELOPE_CODES;
    const envelope = ENVELOPE_CODES[code];

    if (!envelope) {
      setCodeError("Invalid code. Check your envelope.");
      return;
    }

    if (currentTeam?.usedCodes.includes(code)) {
      setCodeError("Your team already used this code!");
      return;
    }

    // 1. Check Concurrency and Cooldown
    try {
      // Clean up expired attempts/failed ones
      const now = new Date().toISOString();
      
      // Check for this user's cooldown on this code
      const { data: cooldownData } = await supabase
        .from("bounty_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("code", code)
        .eq("status", "failed")
        .gt("expires_at", now)
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cooldownData) {
        const remaining = Math.ceil((new Date(cooldownData.expires_at).getTime() - Date.now()) / 1000);
        setCodeError(`Cooldown active! Wait ${remaining}s to retry code ${code}.`);
        return;
      }

      // Check current active users for this code
      const { count } = await supabase
        .from("bounty_attempts")
        .select("*", { count: 'exact', head: true })
        .eq("code", code)
        .eq("status", "active")
        .gt("expires_at", now);

      if (count && count >= 2) {
        setCodeError("Bounty busy! Only 2 teams can hunt this code at once.");
        return;
      }

      // 2. Register Active Attempt
      const { error: attemptError } = await supabase
        .from("bounty_attempts")
        .insert({
          user_id: userId,
          code: code,
          status: "active",
          expires_at: new Date(Date.now() + 130000).toISOString() // 2m 10s (buffer over 120s timeout)
        });

      if (attemptError) throw attemptError;

      const gameType = getRandomGame(envelope.difficulty);
      const puzzle = getPuzzle(gameType, envelope.difficulty);
      setActiveGame({ code, envelope, gameType, puzzle, startTime: Date.now() });
      setCodeError("");
      setCodeInput("");
      setScreen("game");
    } catch (err) {
      console.error("Bounty safety check error:", err);
      setCodeError("Safety check failed. Try again.");
    }
  };

  const handleGameComplete = async (won: boolean, bonusPoints = 0) => {
    if (!won || !activeGame || !currentTeam || !userId) {
      // Mark attempt as failed if lost/exited
      if (activeGame && userId) {
        await supabase
          .from("bounty_attempts")
          .update({ 
            status: "failed", 
            expires_at: new Date(Date.now() + 120000).toISOString() 
          })
          .eq("user_id", userId)
          .eq("code", activeGame.code)
          .eq("status", "active");
      }
      setScreen("team");
      setActiveGame(null);
      return;
    }

    const base = activeGame.envelope.points;
    const total = base + bonusPoints;
    const elapsed = (Date.now() - activeGame.startTime) / 1000;
    const speedBonus = elapsed < 30 ? 20 : elapsed < 60 ? 10 : 0;
    const finalPoints = total + speedBonus;

    const newSolved = [
      ...currentTeam.solved,
      {
        code: activeGame.code,
        game: activeGame.gameType,
        points: finalPoints,
      },
    ];
    const newScore = currentTeam.score + finalPoints;
    const newUsedCodes = [...currentTeam.usedCodes, activeGame.code];

    // Persist Result to Leaderboard
    const { error: lbError } = await supabase
      .from("darkmark_leaderboard")
      .upsert({
        user_id: userId,
        team_name: currentTeam.name,
        score: newScore,
        solved_count: newSolved.length,
        solved_data: newSolved,
        updated_at: new Date().toISOString(),
      });

    // Update Attempt Status
    await supabase
      .from("bounty_attempts")
      .update({ 
        status: won ? "solved" : "failed",
        expires_at: won ? new Date().toISOString() : new Date(Date.now() + 120000).toISOString() // 2 min cooldown if failed
      })
      .eq("user_id", userId)
      .eq("code", activeGame.code)
      .eq("status", "active");

    if (lbError) {
      console.error("Score persist error:", lbError);
      showNotification("Failed to save score online!", "warn");
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== currentTeam.id) return t;
        return {
          ...t,
          score: newScore,
          solved: newSolved,
          usedCodes: newUsedCodes,
        };
      }),
    );

    setCurrentTeam((prev) =>
      prev
        ? {
            ...prev,
            score: newScore,
            solved: newSolved,
            usedCodes: newUsedCodes,
          }
        : null,
    );

    showNotification(
      `+${finalPoints} pts! ${speedBonus > 0 ? `(+${speedBonus} speed bonus!)` : ""}`,
    );
    setScreen("team");
    setActiveGame(null);
  };

  const registerTeam = (name: string, players: string[]) => {
    const team: Team = {
      id: `t${Date.now()}`,
      name,
      players,
      score: 0,
      solved: [],
      usedCodes: [],
    };
    setTeams((prev) => [...prev, team]);
    setCurrentTeam(team);
    setScreen("team");
  };

  const loginTeam = (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (team) {
      setCurrentTeam(team);
      setScreen("team");
    }
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="dark-mark-bounty-root">
      <div style={{ height: '100%' }}>
          {notification && (
            <div className={`notif notif-${notification.type}`}>
              {notification.msg}
            </div>
          )}

          {screen === "team" && currentTeam && (
            <TeamDashboard
              team={teams.find((t) => t.id === currentTeam.id) || currentTeam}
              codeInput={codeInput}
              setCodeInput={setCodeInput}
              codeError={codeError}
              onSubmitCode={handleCodeSubmit}
              onLeaderboard={() => setScreen("leaderboard")}
              onLogout={async () => {
                // Logout now just takes you back to the leaderboard or resets view
                await supabase.auth.signOut();
                navigate('/login');
              }}
            />
          )}

          {screen === "game" && activeGame && (
            <GameScreen game={activeGame} onComplete={handleGameComplete} />
          )}

          {screen === "leaderboard" && (
            <LeaderboardScreen
              onBack={() => setScreen("team")}
            />
          )}

          {/* {screen === "admin" && (
            <AdminScreen
              teams={sortedTeams}
              codes={ENVELOPE_CODES}
              onBack={() => setScreen("landing")}
              onReset={() => {
                setTeams(INITIAL_TEAMS);
                showNotification("All scores reset", "warn");
              }}
            />
          )} */}
      </div>
    </div>
  );
};
