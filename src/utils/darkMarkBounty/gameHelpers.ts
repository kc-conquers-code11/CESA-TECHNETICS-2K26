import { getPuzzleForCode } from "@/components/data/darkMarkBounty/puzzleMapping";
import type { GameType } from "@/components/data/darkMarkBounty";
import type { Difficulty } from "@/components/data/darkMarkBounty/envelopeCodes";

export { getPuzzleForCode };

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
