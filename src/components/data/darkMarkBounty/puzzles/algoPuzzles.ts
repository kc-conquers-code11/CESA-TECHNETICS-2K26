export const ALGO_PUZZLES = {
  easy: {
    title: "Bubble Sort",
    blocks: [
      "Start",
      "Compare elements",
      "Swap if needed",
      "Repeat pass",
      "Stop when sorted",
    ],
  },
  medium: {
    title: "Binary Search",
    blocks: [
      "Start with sorted array",
      "Set left=0, right=end",
      "Find midpoint",
      "Compare mid to target",
      "Narrow left or right",
      "Return index or -1",
    ],
  },
  hard: {
    title: "Dijkstra's Algorithm",
    blocks: [
      "Initialize distances to ∞",
      "Set source distance = 0",
      "Add source to priority queue",
      "Dequeue lowest distance node",
      "For each neighbor",
      "Calculate tentative distance",
      "Update if shorter",
      "Mark node as visited",
      "Repeat until queue empty",
    ],
  },
} as const;
