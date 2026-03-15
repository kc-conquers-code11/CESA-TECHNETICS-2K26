import React, { useState } from "react";

interface Props {
  puzzle: {
    question: string;
    options: string[];
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const TerminalGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [chosen, setChosen] = useState<string | null>(null);

  const pick = (opt: string) => {
    setChosen(opt);
    setTimeout(() => onAnswer(opt === puzzle.answer), 400);
  };

  return (
    <div className="puzzle-box">
      <h2>Terminal Command</h2>
      <div className="terminal-prompt">$ _</div>
      <p style={{ marginTop: 16 }}>{puzzle.question}</p>
      <p className="hint">💡 {puzzle.hint}</p>
      <div className="terminal-options">
        {puzzle.options.map((opt) => (
          <button
            key={opt}
            className={`btn terminal-opt ${chosen === opt ? (opt === puzzle.answer ? "btn-correct" : "btn-wrong") : ""}`}
            onClick={() => !chosen && pick(opt)}
          >
            <span className="term-dollar">$</span> {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
