import type {
    EnvelopeCode,
    Difficulty,
    Color,
} from "../data/darkMarkBounty/envelopeCodes";
import type { GameType } from "../data/darkMarkBounty";

export interface Team {
  id: string;
  name: string;
  players: string[];
  score: number;
  solved: SolvedBounty[];
  usedCodes: EnvelopeCode[];
}

export interface SolvedBounty {
  code: EnvelopeCode;
  game: GameType;
  points: number;
}

export interface Envelope {
  color: Color;
  difficulty: Difficulty;
  points: number;
}

export interface ActiveGame {
  code: EnvelopeCode;
  envelope: Envelope;
  gameType: GameType;
  puzzle: any;
  startTime: number;
}

export interface Notification {
  msg: string;
  type: "success" | "warn";
}

export type Screen =
  | "landing"
  | "login"
  | "register"
  | "team"
  | "game"
  | "leaderboard"
  | "admin";
