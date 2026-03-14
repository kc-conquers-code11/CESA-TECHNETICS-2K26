export const DEBUG_PUZZLES = {
  easy: [
    {
      code: `for i in range(5)\n    print(i)`,
      answer: ":",
      hint: "Missing syntax character at end of first line",
      full: `for i in range(5):\n    print(i)`,
      question: "What single character is missing from line 1?",
    },
    {
      code: `if x = 10:\n    print("yes")`,
      answer: "==",
      hint: "Assignment vs comparison",
      full: `if x == 10:\n    print("yes")`,
      question: "What should replace '=' in the condition?",
    },
    {
      code: `def add(a, b)\n    return a + b`,
      answer: ":",
      hint: "Function definition syntax",
      full: `def add(a, b):\n    return a + b`,
      question: "What is missing at the end of the def line?",
    },
  ],
  medium: [
    {
      code: `total = 0\nfor i in range(1, 11):\n    total = i\nprint(total)`,
      answer: "+=",
      hint: "Should accumulate, not assign",
      question: "What operator should replace '=' on line 3?",
    },
    {
      code: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n)`,
      answer: "n-1",
      hint: "Recursion must reduce the problem",
      question: "What should be inside factorial() on the last line?",
    },
  ],
  hard: [
    {
      code: `def binary_search(arr, target):\n    left, right = 0, len(arr)\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid\n        else:\n            right = mid\n    return -1`,
      answer: "mid+1 and mid-1",
      hint: "The search never narrows properly",
      question: "What should left= and right= be when adjusting?",
    },
  ],
} as const;
