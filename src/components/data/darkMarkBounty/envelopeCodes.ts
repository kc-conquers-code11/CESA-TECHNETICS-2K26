export const ENVELOPE_CODES = {
  // Yellow = Easy (50pts)
  DM101: { color: "yellow", difficulty: "easy", points: 50 },
  DM102: { color: "yellow", difficulty: "easy", points: 50 },
  DM103: { color: "yellow", difficulty: "easy", points: 50 },
  DM104: { color: "yellow", difficulty: "easy", points: 50 },
  DM105: { color: "yellow", difficulty: "easy", points: 50 },
  DM106: { color: "yellow", difficulty: "easy", points: 50 },
  DM107: { color: "yellow", difficulty: "easy", points: 50 },
  DM108: { color: "yellow", difficulty: "easy", points: 50 },
  DM109: { color: "yellow", difficulty: "easy", points: 50 },
  DM110: { color: "yellow", difficulty: "easy", points: 50 },
  DM111: { color: "yellow", difficulty: "easy", points: 50 },
  DM112: { color: "yellow", difficulty: "easy", points: 50 },
  DM113: { color: "yellow", difficulty: "easy", points: 50 },
  DM114: { color: "yellow", difficulty: "easy", points: 50 },
  DM115: { color: "yellow", difficulty: "easy", points: 50 },
  // Orange = Medium (100pts)
  DM201: { color: "orange", difficulty: "medium", points: 100 },
  DM202: { color: "orange", difficulty: "medium", points: 100 },
  DM203: { color: "orange", difficulty: "medium", points: 100 },
  DM204: { color: "orange", difficulty: "medium", points: 100 },
  DM205: { color: "orange", difficulty: "medium", points: 100 },
  DM206: { color: "orange", difficulty: "medium", points: 100 },
  DM207: { color: "orange", difficulty: "medium", points: 100 },
  DM208: { color: "orange", difficulty: "medium", points: 100 },
  DM209: { color: "orange", difficulty: "medium", points: 100 },
  DM210: { color: "orange", difficulty: "medium", points: 100 },
  DM211: { color: "orange", difficulty: "medium", points: 100 },
  DM212: { color: "orange", difficulty: "medium", points: 100 },
  DM213: { color: "orange", difficulty: "medium", points: 100 },
  DM214: { color: "orange", difficulty: "medium", points: 100 },
  DM215: { color: "orange", difficulty: "medium", points: 100 },
  // Red = Hard (200pts)
  DM301: { color: "red", difficulty: "hard", points: 200 },
  DM302: { color: "red", difficulty: "hard", points: 200 },
  DM303: { color: "red", difficulty: "hard", points: 200 },
  DM304: { color: "red", difficulty: "hard", points: 200 },
  DM305: { color: "red", difficulty: "hard", points: 200 },
  DM306: { color: "red", difficulty: "hard", points: 200 },
  DM307: { color: "red", difficulty: "hard", points: 200 },
  DM308: { color: "red", difficulty: "hard", points: 200 },
  DM309: { color: "red", difficulty: "hard", points: 200 },
  DM310: { color: "red", difficulty: "hard", points: 200 },
} as const;

export type EnvelopeCode = keyof typeof ENVELOPE_CODES;
export type Difficulty = "easy" | "medium" | "hard";
export type Color = "yellow" | "orange" | "red";
