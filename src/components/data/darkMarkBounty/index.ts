import { ALGO_PUZZLES } from "./puzzles/algoPuzzles";
import { BASE_PUZZLES } from "./puzzles/basePuzzles";
import { BINARY_PUZZLES } from "./puzzles/binaryPuzzles";
import { CIPHER_PUZZLES } from "./puzzles/cipherPuzzles";
import { DEBUG_PUZZLES } from "./puzzles/debugPuzzles";
import { DS_PUZZLES } from "./puzzles/dsPuzzles";
import { LOGIC_PUZZLES } from "./puzzles/logicPuzzles";
import { LOGO_PUZZLES } from "./puzzles/logoPuzzles";
import { MEMORY_PUZZLES } from "./puzzles/memoryPuzzles";
import { OUTPUT_PUZZLES } from "./puzzles/outputPuzzles";
import { PATTERN_PUZZLES } from "./puzzles/patternPuzzles";
import { SQL_PUZZLES } from "./puzzles/sqlPuzzles";
import { STACK_PUZZLES } from "./puzzles/stackPuzzles";
import { SWAP_PUZZLES } from "./puzzles/swapPuzzles";
import { TERMINAL_PUZZLES } from "./puzzles/terminalPuzzles";

export { ENVELOPE_CODES } from "./envelopeCodes";
export type { EnvelopeCode, Difficulty, Color } from "./envelopeCodes";


export const PUZZLES = {
  binary: BINARY_PUZZLES,
  cipher: CIPHER_PUZZLES,
  pattern: PATTERN_PUZZLES,
  logic: LOGIC_PUZZLES,
  debug: DEBUG_PUZZLES,
  memory: MEMORY_PUZZLES,
  algo: ALGO_PUZZLES,
  sql: SQL_PUZZLES,
  logo: LOGO_PUZZLES,
  base: BASE_PUZZLES,
  stack: STACK_PUZZLES,
  ds: DS_PUZZLES,
  swap: SWAP_PUZZLES,
  terminal: TERMINAL_PUZZLES,
  output: OUTPUT_PUZZLES,
} as const;

export const GAME_TYPES = [
  "binary",
  "cipher",
  "pattern",
  "logic",
  "debug",
  "memory",
  "algo",
  "sql",
  "logo",
  "base",
  "stack",
  "ds",
  "swap",
  "terminal",
  "output",
] as const;

export type GameType = (typeof GAME_TYPES)[number];
