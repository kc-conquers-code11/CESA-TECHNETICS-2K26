import React, { useState } from "react";

interface Props {
  puzzle: {
    diagram: string;
    options: string[];
    answer: string;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const DataStructureGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [chosen, setChosen] = useState<string | null>(null);

  const pick = (opt: string) => {
    setChosen(opt);
    setTimeout(() => onAnswer(opt === puzzle.answer), 400);
  };

  return (
    <div className="puzzle-box">
      <h2>Data Structure ID</h2>
      <p>What data structure is shown below?</p>
      <div className="ds-diagram">{puzzle.diagram}</div>
      <p className="hint">💡 {puzzle.hint}</p>
      <div className="logo-options">
        {puzzle.options.map((opt) => (
          <button
            key={opt}
            className={`btn btn-option ${chosen === opt ? (opt === puzzle.answer ? "btn-correct" : "btn-wrong") : ""}`}
            onClick={() => !chosen && pick(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
