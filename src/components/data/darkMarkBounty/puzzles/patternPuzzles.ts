export const PATTERN_PUZZLES = {
  easy: [
    { sequence: "2, 4, 6, 8, ?", answer: "10", hint: "Add 2 each time" },
    { sequence: "1, 3, 9, 27, ?", answer: "81", hint: "Multiply by 3" },
    {
      sequence: "AB, ABC, ABCD, ?",
      answer: "ABCDE",
      hint: "One letter added each time",
    },
  ],
  medium: [
    {
      sequence: "2, 6, 7, 21, 22, ?",
      answer: "66",
      hint: "Alternate ×3 and +1",
    },
    {
      sequence: "1, 1, 2, 3, 5, 8, ?",
      answer: "13",
      hint: "Add the previous two",
    },
    {
      sequence: "3, 6, 10, 15, 21, ?",
      answer: "28",
      hint: "Differences increase by 1",
    },
  ],
  hard: [
    { sequence: "1, 4, 9, 16, 25, ?", answer: "36", hint: "Perfect squares" },
    { sequence: "2, 3, 5, 7, 11, ?", answer: "13", hint: "Prime numbers" },
    {
      sequence: "0, 1, 3, 6, 10, 15, ?",
      answer: "21",
      hint: "Triangular numbers",
    },
  ],
} as const;
