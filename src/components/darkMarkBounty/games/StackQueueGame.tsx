import React, { useState } from "react";

interface Props {
  puzzle: {
    type: string;
    ops: string[];
    question: string;
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const StackQueueGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");
  const isStack = puzzle.type === "stack";

  return (
    <div className="puzzle-box">
      <h2>{isStack ? "Stack" : "Queue"} Simulation</h2>
      <p>
        Trace through these operations on a <strong>{puzzle.type}</strong>:
      </p>
      <div className="stack-ops">
        {puzzle.ops.map((op, i) => {
          const isPush = op.startsWith("Push") || op.startsWith("Enqueue");
          return (
            <div
              key={i}
              className={`stack-op ${isPush ? "op-push" : "op-pop"}`}
            >
              <span className="op-num">{i + 1}</span>
              <span className="op-icon">
                {isStack ? (isPush ? "⬆" : "⬇") : isPush ? "→" : "←"}
              </span>
              {op}
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 16, fontWeight: "bold", color: "#e8e4d4" }}>
        ❓ {puzzle.question}
      </p>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder="Your answer"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          onAnswer(val.trim().toUpperCase() === puzzle.answer.toUpperCase())
        }
      />
      <button
        className="btn btn-primary"
        onClick={() =>
          onAnswer(val.trim().toUpperCase() === puzzle.answer.toUpperCase())
        }
      >
        Submit
      </button>
    </div>
  );
};
