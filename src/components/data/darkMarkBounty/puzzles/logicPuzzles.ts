export const LOGIC_PUZZLES = {
  easy: [
    { pairs: ["2 → 6", "3 → 9", "4 → 12", "5 → ?"], answer: "15", hint: "×3" },
    {
      pairs: ["1 → 3", "2 → 5", "3 → 7", "4 → ?"],
      answer: "9",
      hint: "×2 + 1",
    },
    { pairs: ["10 → 5", "8 → 4", "6 → 3", "4 → ?"], answer: "2", hint: "÷2" },
  ],
  medium: [
    {
      pairs: ["2 → 8", "3 → 27", "4 → 64", "5 → ?"],
      answer: "125",
      hint: "Cube the input",
    },
    {
      pairs: ["1 → 2", "2 → 6", "3 → 12", "4 → ?"],
      answer: "20",
      hint: "n × (n+1)",
    },
    {
      pairs: ["5 → 24", "4 → 15", "3 → 8", "2 → ?"],
      answer: "3",
      hint: "n² - 1",
    },
  ],
  hard: [
    {
      pairs: ["1 → 1", "2 → 4", "3 → 27", "4 → ?"],
      answer: "256",
      hint: "n^n",
    },
    {
      pairs: ["0 → 0", "1 → 1", "2 → 8", "3 → ?"],
      answer: "27",
      hint: "Think triangular + cube",
    },
    {
      pairs: ["2 → 5", "3 → 10", "4 → 17", "5 → ?"],
      answer: "26",
      hint: "n² + 1",
    },
  ],
} as const;
