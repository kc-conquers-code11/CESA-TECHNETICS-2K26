import React, { useState, useEffect } from "react";
import type { ActiveGame } from "@/types/darkMarkBounty";
import {
  GAME_NAMES,
  DIFFICULTY_LABELS,
} from "@/utils/darkMarkBounty/gameHelpers";
import {
  GAME_TIMEOUT,
  MAX_ATTEMPTS,
} from "@/utils/darkMarkBounty/constants";
import { BinaryGame } from "../games/BinaryGame";
import { CipherGame } from "../games/CipherGame";
import { PatternGame } from "../games/PatternGame";
import { LogicGame } from "../games/LogicGame";
import { DebugGame } from "../games/DebugGame";
import { MemoryGame } from "../games/MemoryGame";
import { AlgoGame } from "../games/AlgoGame";
import { SQLGame } from "../games/SQLGame";
import { LogoGame } from "../games/LogoGame";
import { BaseConversionGame } from "../games/BaseConversionGame";
import { StackQueueGame } from "../games/StackQueueGame";
import { DataStructureGame } from "../games/DataStructureGame";
import { SwapSortGame } from "../games/SwapSortGame";
import { TerminalGame } from "../games/TerminalGame";
import { CodeOutputGame } from "../games/CodeOutputGame";

interface Props {
  game: ActiveGame;
  onComplete: (won: boolean, bonusPoints?: number) => void;
}

export const GameScreen: React.FC<Props> = ({ game, onComplete }) => {
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [timeLeft, setTimeLeft] = useState(GAME_TIMEOUT);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!done) {
            setDone(true);
            onComplete(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [done, onComplete]);

  const handleAnswer = (correct: boolean) => {
    if (done) return;

    if (correct) {
      setDone(true);
      onComplete(true);
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        setDone(true);
        onComplete(false);
      }
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor =
    timeLeft < 30 ? "#ff4444" : timeLeft < 60 ? "#ff9900" : "#00ff88";

  const diffLabel = DIFFICULTY_LABELS[game.envelope.difficulty];

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <div className="game-meta">
          <span className="game-type-badge">{GAME_NAMES[game.gameType]}</span>
          <span className="diff-badge">
            {diffLabel.icon} {diffLabel.label} · {game.envelope.points}pts
          </span>
        </div>
        <div className="game-stats">
          <div className="timer" style={{ color: timerColor }}>
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <div className="attempts">{"🔥".repeat(attempts)}</div>
        </div>
      </div>

      <div className="game-body">
        {game.gameType === "binary" && (
          <BinaryGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "cipher" && (
          <CipherGame
            puzzle={game.puzzle}
            difficulty={game.envelope.difficulty}
            onAnswer={handleAnswer}
          />
        )}
        {game.gameType === "pattern" && (
          <PatternGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "logic" && (
          <LogicGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "debug" && (
          <DebugGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "memory" && (
          <MemoryGame
            puzzle={game.puzzle}
            difficulty={game.envelope.difficulty}
            onAnswer={handleAnswer}
          />
        )}
        {game.gameType === "algo" && (
          <AlgoGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "sql" && (
          <SQLGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "logo" && (
          <LogoGame
            puzzle={game.puzzle}
            difficulty={game.envelope.difficulty}
            onAnswer={handleAnswer}
          />
        )}
        {game.gameType === "base" && (
          <BaseConversionGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "stack" && (
          <StackQueueGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "ds" && (
          <DataStructureGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "swap" && (
          <SwapSortGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "terminal" && (
          <TerminalGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
        {game.gameType === "output" && (
          <CodeOutputGame puzzle={game.puzzle} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  );
};
