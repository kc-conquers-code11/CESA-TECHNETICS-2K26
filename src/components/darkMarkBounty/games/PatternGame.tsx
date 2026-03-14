import React, { useState } from "react";

interface Props {
  puzzle: {
    sequence: string;
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const PatternGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  return (
    <div className="puzzle-box">
      <h2>Pattern Recognition</h2>
      <p>What comes next?</p>
      <div className="pattern-display">{puzzle.sequence}</div>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder="Next value"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && onAnswer(val.trim() === puzzle.answer)
        }
      />
      <button
        className="btn btn-primary"
        onClick={() => onAnswer(val.trim() === puzzle.answer)}
      >
        Submit
      </button>
    </div>
  );
};
