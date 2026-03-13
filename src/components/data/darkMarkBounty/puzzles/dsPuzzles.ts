export const DS_PUZZLES = {
  easy: [
    {
      diagram: "10 → 20 → 30 → 40",
      options: ["Linked List", "Stack", "Array", "Queue"],
      answer: "Linked List",
      hint: "Nodes connected by pointers",
    },
    {
      diagram: "[ TOP ]\n  7\n  4\n  2\n[BOTTOM]",
      options: ["Queue", "Stack", "Heap", "Tree"],
      answer: "Stack",
      hint: "Last In, First Out",
    },
    {
      diagram: "[1] [2] [3] [4] [5]",
      options: ["Array", "Tree", "Graph", "Queue"],
      answer: "Array",
      hint: "Contiguous indexed elements",
    },
  ],
  medium: [
    {
      diagram:
        "      10\n     /  \\\n    5    15\n   / \\     \\\n  3   7    20",
      options: ["Binary Tree", "Heap", "Graph", "Linked List"],
      answer: "Binary Tree",
      hint: "Each node has at most 2 children",
    },
    {
      diagram: "FRONT → A → B → C → D ← REAR",
      options: ["Queue", "Stack", "Deque", "List"],
      answer: "Queue",
      hint: "First In, First Out",
    },
    {
      diagram:
        "      50\n     /  \\\n    30    70\n   / \\   / \\\n  20 40 60 80",
      options: ["BST", "Max Heap", "AVL Tree", "Trie"],
      answer: "BST",
      hint: "Left < Parent < Right",
    },
  ],
  hard: [
    {
      diagram:
        "      100\n      /  \\\n    90    80\n   /  \\  /  \\\n  70  60 75  50",
      options: ["Max Heap", "BST", "Min Heap", "Red-Black Tree"],
      answer: "Max Heap",
      hint: "Parent always ≥ children",
    },
    {
      diagram: "A — B\n|   |\nC — D\n |  \nE",
      options: ["Graph", "Tree", "Linked List", "Matrix"],
      answer: "Graph",
      hint: "Nodes connected by edges, can have cycles",
    },
    {
      diagram:
        "root\n├── t\n│   └── e\n│       ├── a → tea\n│       └── n → ten\n└── i\n    └── n → in",
      options: ["Trie", "BST", "Heap", "B-Tree"],
      answer: "Trie",
      hint: "Used for prefix-based string search",
    },
  ],
} as const;
