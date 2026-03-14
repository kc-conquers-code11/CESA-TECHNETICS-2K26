import React, { useState } from "react";

interface Props {
  puzzle: {
    code: string;
    answer: string;
    hint: string;
    question: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const DebugGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  return (
    <div className="puzzle-box">
      <h2>Debug the Code</h2>
      <p>{puzzle.question}</p>
      <div className="code-block">{puzzle.code}</div>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder="Your fix"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          onAnswer(val.trim().toLowerCase() === puzzle.answer.toLowerCase())
        }
      />
      <button
        className="btn btn-primary"
        onClick={() =>
          onAnswer(val.trim().toLowerCase() === puzzle.answer.toLowerCase())
        }
      >
        Submit
      </button>
    </div>
  );
};
