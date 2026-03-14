import { PUZZLES, GAME_TYPES, type GameType } from "../../data/darkMarkBounty";
import type { Difficulty } from "../../data/darkMarkBounty/envelopeCodes";

export const getRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomGame = (difficulty: Difficulty): GameType => {
  return getRandom([...GAME_TYPES]);
};

export const getPuzzle = (gameType: GameType, difficulty: Difficulty) => {
  const puzzles = PUZZLES[gameType];
  const difficultyPuzzles = puzzles[difficulty as keyof typeof puzzles];

  if (
    !difficultyPuzzles ||
    (Array.isArray(difficultyPuzzles) && difficultyPuzzles.length === 0)
  ) {
    return getRandom(puzzles.easy as unknown as any[]);
  }

  return getRandom(difficultyPuzzles as unknown as any[]);
};

export const GAME_NAMES: Record<GameType, string> = {
  binary: "Binary Decoder",
  cipher: "Cipher Decryption",
  pattern: "Pattern Recognition",
  logic: "Reverse Logic",
  debug: "Debug the Code",
  memory: "Memory Match",
  algo: "Algorithm Order",
  sql: "SQL Puzzle",
  logo: "Tech Logo Guess",
  base: "Base Conversion",
  stack: "Stack & Queue Sim",
  ds: "Data Structure ID",
  swap: "Min Swap Sort",
  terminal: "Terminal Command",
  output: "Code Output",
};

export const DIFFICULTY_LABELS: Record<
  Difficulty,
  { icon: string; label: string }
> = {
  easy: { icon: "🟡", label: "Easy" },
  medium: { icon: "🟠", label: "Medium" },
  hard: { icon: "🔴", label: "Hard" },
};
