export const SWAP_PUZZLES = {
  easy: [
    {
      arr: [8, 3, 5, 1],
      sorted: [1, 3, 5, 8],
      minSwaps: 2,
      hint: "Find minimum swaps to sort",
    },
    {
      arr: [4, 2, 1, 3],
      sorted: [1, 2, 3, 4],
      minSwaps: 3,
      hint: "Try to place each element in order",
    },
  ],
  medium: [
    {
      arr: [6, 4, 1, 3, 2, 5],
      sorted: [1, 2, 3, 4, 5, 6],
      minSwaps: 4,
      hint: "Cycle detection minimizes swaps",
    },
    {
      arr: [3, 1, 4, 2, 6, 5],
      sorted: [1, 2, 3, 4, 5, 6],
      minSwaps: 3,
      hint: "Track cycles in permutation",
    },
  ],
  hard: [
    {
      arr: [8, 7, 6, 5, 4, 3, 2, 1],
      sorted: [1, 2, 3, 4, 5, 6, 7, 8],
      minSwaps: 4,
      hint: "Reversed array — n/2 swaps",
    },
    {
      arr: [5, 2, 8, 1, 6, 4, 7, 3],
      sorted: [1, 2, 3, 4, 5, 6, 7, 8],
      minSwaps: 5,
      hint: "Count cycles: swaps = n - cycles",
    },
  ],
} as const;
