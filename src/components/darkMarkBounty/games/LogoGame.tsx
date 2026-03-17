import React, { useState } from "react";
import type { Difficulty } from "@/components/data/darkMarkBounty/envelopeCodes";

interface Props {
  puzzle: {
    name: string;
    svg: string;
    options: string[];
    blur: number;
  };
  difficulty: Difficulty;
  onAnswer: (correct: boolean) => void;
}

export const LogoGame: React.FC<Props> = ({ puzzle, difficulty, onAnswer }) => {
  const blurMap = { easy: 4, medium: 10, hard: 18 };
  const blur = blurMap[difficulty];
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="puzzle-box">
      <h2>Tech Logo Guess</h2>
      <p>Which technology does this represent?</p>
      <div
        className="logo-display"
        style={{ filter: revealed ? "none" : `blur(${blur}px)` }}
      >
        <span style={{ fontSize: 80 }}>{puzzle.svg}</span>
      </div>
      <div className="logo-options">
        {puzzle.options.map((opt) => (
          <button
            key={opt}
            className={`btn btn-option ${chosen === opt ? (opt === puzzle.name ? "btn-correct" : "btn-wrong") : ""}`}
            onClick={() => {
              if (chosen) return;
              setChosen(opt);
              setRevealed(true);
              setTimeout(() => {
                const correct = opt === puzzle.name;
                onAnswer(correct);
                if (!correct) {
                  setChosen(null);
                  setRevealed(false);
                }
              }, 400);
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
