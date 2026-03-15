import React, { useState } from "react";

interface Props {
  puzzle: {
    binary: string;
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const BinaryGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  return (
    <div className="puzzle-box">
      <h2>Binary Decoder</h2>
      <p>Convert this binary to text:</p>
      <div className="mono-display">{puzzle.binary}</div>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder="Your answer"
        value={val}
        onChange={(e) => setVal(e.target.value.toUpperCase())}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          onAnswer(val.trim().toUpperCase() === puzzle.answer)
        }
      />
      <button
        className="btn btn-primary"
        onClick={() => onAnswer(val.trim().toUpperCase() === puzzle.answer)}
      >
        Submit
      </button>
    </div>
  );
};
