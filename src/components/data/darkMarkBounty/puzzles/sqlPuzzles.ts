export const SQL_PUZZLES = {
  easy: {
    table: [
      { id: 1, name: "Alice", marks: 92 },
      { id: 2, name: "Bob", marks: 74 },
      { id: 3, name: "Carol", marks: 85 },
      { id: 4, name: "Dave", marks: 61 },
      { id: 5, name: "Eve", marks: 97 },
    ],
    query: "SELECT * FROM students WHERE marks > 80",
    correct: [1, 3, 5],
  },
  medium: {
    table: [
      { id: 1, name: "Alice", dept: "CS", salary: 75000 },
      { id: 2, name: "Bob", dept: "IT", salary: 65000 },
      { id: 3, name: "Carol", dept: "CS", salary: 82000 },
      { id: 4, name: "Dave", dept: "HR", salary: 55000 },
      { id: 5, name: "Eve", dept: "CS", salary: 91000 },
      { id: 6, name: "Frank", dept: "IT", salary: 70000 },
    ],
    query: "SELECT * FROM employees WHERE dept = 'CS' AND salary > 80000",
    correct: [3, 5],
  },
  hard: {
    table: [
      { id: 1, product: "Widget", category: "A", qty: 30 },
      { id: 2, product: "Gadget", category: "B", qty: 15 },
      { id: 3, product: "Gizmo", category: "A", qty: 25 },
      { id: 4, product: "Doohickey", category: "B", qty: 40 },
      { id: 5, product: "Thingamajig", category: "A", qty: 10 },
    ],
    query: "SELECT * FROM products WHERE category = 'A' AND qty > 20",
    correct: [1, 3],
  },
} as const;
