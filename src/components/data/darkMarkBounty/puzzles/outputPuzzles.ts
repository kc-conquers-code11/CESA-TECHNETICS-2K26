export const OUTPUT_PUZZLES = {
  easy: [
    {
      code: `for i in range(3):\n    print(i)`,
      answer: "0\n1\n2",
      display: "0\n1\n2",
      hint: "range(3) gives 0, 1, 2",
    },
    {
      code: `x = 5\nif x > 3:\n    print("big")\nelse:\n    print("small")`,
      answer: "big",
      display: "big",
      hint: "Is 5 > 3?",
    },
    {
      code: `print(2 ** 8)`,
      answer: "256",
      display: "256",
      hint: "** is exponentiation",
    },
  ],
  medium: [
    {
      code: `for i in range(3):\n    for j in range(3):\n        if i == j:\n            print(i, j)`,
      answer: "0 0\n1 1\n2 2",
      display: "0 0\n1 1\n2 2",
      hint: "Only prints when i equals j",
    },
    {
      code: `x = [1,2,3,4,5]\nprint(sum(x[1:4]))`,
      answer: "9",
      display: "9",
      hint: "x[1:4] = [2,3,4]",
    },
    {
      code: `def f(n):\n    return n * 2 if n < 5 else n + 10\nprint(f(3))\nprint(f(7))`,
      answer: "6\n17",
      display: "6\n17",
      hint: "Apply the ternary rule for each call",
    },
  ],
  hard: [
    {
      code: `def fact(n):\n    return 1 if n==0 else n*fact(n-1)\nprint(fact(5))`,
      answer: "120",
      display: "120",
      hint: "5! = 5×4×3×2×1",
    },
    {
      code: `a = [1,2,3]\nb = a\nb.append(4)\nprint(a)`,
      answer: "[1, 2, 3, 4]",
      display: "[1, 2, 3, 4]",
      hint: "b = a is a reference, not a copy",
    },
    {
      code: `x = 0\nfor i in range(1,6):\n    x += i\n    if x > 10:\n        break\nprint(x)`,
      answer: "15",
      display: "15",
      hint: "1+2+3+4+5=15, check when > 10",
    },
  ],
} as const;
