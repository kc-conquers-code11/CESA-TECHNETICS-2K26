export const BINARY_PUZZLES = {
  easy: [
    {
      binary: "01001000 01001001",
      answer: "HI",
      hint: "Each group of 8 bits = 1 character",
    },
    {
      binary: "01001111 01001011",
      answer: "OK",
      hint: "ASCII binary encoding",
    },
    {
      binary: "01001110 01001111",
      answer: "NO",
      hint: "Convert each byte to decimal, then to ASCII",
    },
  ],
  medium: [
    {
      binary: "01000011 01001111 01000100 01000101",
      answer: "CODE",
      hint: "4 characters",
    },
    {
      binary: "01001000 01000001 01000011 01001011",
      answer: "HACK",
      hint: "Think tech",
    },
    {
      binary: "01000100 01000001 01010100 01000001",
      answer: "DATA",
      hint: "What computers store",
    },
  ],
  hard: [
    {
      binary: "010000110100110001000001010101010100010001000101",
      answer: "CLAUDE",
      hint: "No spaces - split every 8 bits",
    },
    {
      binary: "01010000 01011001 01010100 01001000 01001111 01001110",
      answer: "PYTHON",
      hint: "A popular language",
    },
    {
      binary: "01000100 01001111 01000011 01001011 01000101 01010010",
      answer: "DOCKER",
      hint: "Container platform",
    },
  ],
} as const;
