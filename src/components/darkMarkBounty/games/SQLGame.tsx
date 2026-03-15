import React, { useState } from "react";

interface Props {
  puzzle: {
    table: Array<Record<string, any>>;
    query: string;
    correct: number[];
  };
  onAnswer: (correct: boolean) => void;
}

export const SQLGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const check = () => {
    const s = [...selected].sort();
    const c = [...puzzle.correct].sort();
    onAnswer(JSON.stringify(s) === JSON.stringify(c));
  };

  const columns = Object.keys(puzzle.table[0]);

  return (
    <div className="puzzle-box">
      <h2>SQL Result Puzzle</h2>
      <p>Which rows appear in the result of:</p>
      <div className="sql-query">{puzzle.query}</div>
      <p>Select the matching rows:</p>
      <table className="sql-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {puzzle.table.map((row) => (
            <tr
              key={row.id}
              className={selected.includes(row.id) ? "row-selected" : ""}
              onClick={() => toggle(row.id)}
            >
              {columns.map((c) => (
                <td key={c}>{row[c]}</td>
              ))}
              <td>{selected.includes(row.id) ? "✅" : "☐"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={check}>
        Submit Selection
      </button>
    </div>
  );
};
