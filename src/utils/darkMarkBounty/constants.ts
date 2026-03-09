import type { Team } from "../../types/darkMarkBounty";

export const INITIAL_TEAMS: Team[] = [
  {
    id: "t1",
    name: "ByteBusters",
    players: ["Alice", "Bob"],
    score: 0,
    solved: [],
    usedCodes: [],
  },
  {
    id: "t2",
    name: "CodeCrusaders",
    players: ["Carol", "Dave"],
    score: 0,
    solved: [],
    usedCodes: [],
  },
  {
    id: "t3",
    name: "DataDragons",
    players: ["Eve", "Frank"],
    score: 0,
    solved: [],
    usedCodes: [],
  },
];

export const GAME_TIMEOUT = 120; // seconds
export const MAX_ATTEMPTS = 3;
export const SPEED_BONUS_THRESHOLDS = {
  GOLD: 30, // seconds - 20 points
  SILVER: 60, // seconds - 10 points
};

export const SPEED_BONUS_POINTS = {
  GOLD: 20,
  SILVER: 10,
};
