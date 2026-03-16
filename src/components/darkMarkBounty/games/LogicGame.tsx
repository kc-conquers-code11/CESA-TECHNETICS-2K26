import React, { useState } from "react";

interface Props {
  puzzle: {
    pairs: string[];
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const LogicGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  return (
    <div className="puzzle-box">
      <h2>Reverse Logic</h2>
      <p>Deduce the rule and find the missing value:</p>
      <div className="logic-pairs">
        {puzzle.pairs.map((p, i) => (
          <div key={i} className="logic-pair">
            {p}
          </div>
        ))}
      </div>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder="Answer"
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
