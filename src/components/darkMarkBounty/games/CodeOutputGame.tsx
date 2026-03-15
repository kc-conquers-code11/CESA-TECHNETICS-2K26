import React, { useState } from "react";

interface Props {
  puzzle: {
    code: string;
    display: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const CodeOutputGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [val, setVal] = useState("");

  const normalize = (s: string) =>
    s.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  return (
    <div className="puzzle-box">
      <h2>Code Output</h2>
      <p>What does this code print?</p>
      <div className="code-block">{puzzle.code}</div>
      <p className="hint">💡 {puzzle.hint}</p>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        Enter output exactly (one value per line if multiple)
      </p>
      <textarea
        className="input"
        rows={3}
        placeholder="Expected output..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        style={{
          resize: "vertical",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      />
      <button
        className="btn btn-primary"
        onClick={() => onAnswer(normalize(val) === normalize(puzzle.display))}
      >
        Submit
      </button>
    </div>
  );
};
