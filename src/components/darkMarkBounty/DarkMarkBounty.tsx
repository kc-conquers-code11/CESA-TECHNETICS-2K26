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
import "./styles/darkMarkBounty.css";

// import { useServerTimer } from "@/hooks/useServerTimer"; // Temporarily commented out as it's missing

const ROUND_ID = "4";

export const DarkMarkBounty: React.FC = () => {
  const { teamName, email, userId } = useCompetitionStore();
  const [screen, setScreen] = useState<Screen>("team");
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const [adminView, setAdminView] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const { notification, showNotification } = useNotification();
  // const { timerState, formattedTime } = useServerTimer(ROUND_ID);
  const timerState = { timerStatus: "running" }; // Mock
  const formattedTime = "00:00:00"; // Mock

  const handleCodeSubmit = () => {
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

    const gameType = getRandomGame(envelope.difficulty);
    const puzzle = getPuzzle(gameType, envelope.difficulty);
    setActiveGame({ code, envelope, gameType, puzzle, startTime: Date.now() });
    setCodeError("");
    setCodeInput("");
    setScreen("game");
  };

  const handleGameComplete = (won: boolean, bonusPoints = 0) => {
    if (!won || !activeGame || !currentTeam) {
      setScreen("team");
      setActiveGame(null);
      return;
    }

    const base = activeGame.envelope.points;
    const total = base + bonusPoints;
    const elapsed = (Date.now() - activeGame.startTime) / 1000;
    const speedBonus = elapsed < 30 ? 20 : elapsed < 60 ? 10 : 0;
    const finalPoints = total + speedBonus;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== currentTeam.id) return t;
        return {
          ...t,
          score: t.score + finalPoints,
          solved: [
            ...t.solved,
            {
              code: activeGame.code,
              game: activeGame.gameType,
              points: finalPoints,
            },
          ],
          usedCodes: [...t.usedCodes, activeGame.code],
        };
      }),
    );

    setCurrentTeam((prev) =>
      prev
        ? {
            ...prev,
            score: prev.score + finalPoints,
            usedCodes: [...prev.usedCodes, activeGame.code],
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
              onLogout={() => {
                // Logout now just takes you back to the leaderboard or resets view
                setScreen("leaderboard");
              }}
            />
          )}

          {screen === "game" && activeGame && (
            <GameScreen game={activeGame} onComplete={handleGameComplete} />
          )}

          {screen === "leaderboard" && (
            <LeaderboardScreen
              teams={sortedTeams}
              onBack={() => setScreen(currentTeam ? "team" : "landing")}
            />
          )}

          {screen === "admin" && (
            <AdminScreen
              teams={sortedTeams}
              codes={ENVELOPE_CODES}
              onBack={() => setScreen("landing")}
              onReset={() => {
                setTeams(INITIAL_TEAMS);
                showNotification("All scores reset", "warn");
              }}
            />
          )}
      </div>
    </div>
  );
};
