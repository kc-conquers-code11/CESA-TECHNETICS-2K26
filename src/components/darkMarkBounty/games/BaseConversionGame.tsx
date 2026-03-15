import React, { useState } from "react";

interface Props {
  puzzle: {
    display: string;
    from: string;
    to: string;
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const BaseConversionGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  const label = { binary: "Binary", decimal: "Decimal", hex: "Hexadecimal" };

  return (
    <div className="puzzle-box">
      <h2>Base Conversion</h2>
      <p>
        Convert from <strong>{label[puzzle.from as keyof typeof label]}</strong>{" "}
        to <strong>{label[puzzle.to as keyof typeof label]}</strong>:
      </p>
      <div
        className="mono-display"
        style={{ fontSize: 28, letterSpacing: 6, textAlign: "center" }}
      >
        {puzzle.display}
      </div>
      <p className="hint">💡 {puzzle.hint}</p>
      <input
        className="input"
        placeholder={`Answer in ${label[puzzle.to as keyof typeof label]}`}
        value={val}
        onChange={(e) => setVal(e.target.value.toUpperCase())}
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
