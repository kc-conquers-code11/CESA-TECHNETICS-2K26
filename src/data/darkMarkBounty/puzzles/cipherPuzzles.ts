export const CIPHER_PUZZLES = {
  easy: [
    {
      encrypted: "KHOOR",
      answer: "HELLO",
      shift: 3,
      hint: "Caesar cipher, shift = 3",
    },
    {
      encrypted: "ZRUOG",
      answer: "WORLD",
      shift: 3,
      hint: "Caesar cipher, shift = 3",
    },
    {
      encrypted: "FRGH",
      answer: "CODE",
      shift: 3,
      hint: "Caesar cipher, shift = 3",
    },
  ],
  medium: [
    {
      encrypted: "EIBUV",
      answer: "DEBUG",
      shift: null,
      hint: "Unknown shift — try different values",
    },
    {
      encrypted: "CFWF",
      answer: "JAVA",
      shift: null,
      hint: "Unknown shift — find the pattern",
    },
    {
      encrypted: "JLWKXE",
      answer: "GITHUB",
      shift: null,
      hint: "Unknown shift",
    },
  ],
  hard: [
    {
      encrypted: "RIJVS",
      answer: "LINUX",
      shift: null,
      hint: "Multi-layer: try Vigenère with key 'ACE'",
    },
    {
      encrypted: "YMJXY",
      answer: "TESTS",
      shift: null,
      hint: "ROT-5 then Caesar shift 1",
    },
    {
      encrypted: "TQBJQP",
      answer: "NODEJS",
      shift: null,
      hint: "Two-step cipher",
    },
  ],
} as const;
