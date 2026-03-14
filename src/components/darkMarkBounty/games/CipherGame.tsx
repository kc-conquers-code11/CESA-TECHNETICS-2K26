import React, { useState } from "react";
import type { Difficulty } from "@/components/data/darkMarkBounty/envelopeCodes";

interface Props {
  puzzle: {
    encrypted: string;
    answer: string;
    hint: string;
  };
  difficulty: Difficulty;
  onAnswer: (correct: boolean) => void;
}

export const CipherGame: React.FC<Props> = ({
  puzzle,
  difficulty,
  onAnswer,
}) => {
  const [val, setVal] = useState("");

  return (
    <div className="puzzle-box">
      <h2>Cipher Decryption</h2>
      <p>Decrypt this message:</p>
      <div className="cipher-display">{puzzle.encrypted}</div>
      {difficulty === "easy" && (
        <p className="hint">💡 Caesar cipher (shift = 3)</p>
      )}
      {difficulty === "medium" && (
        <p className="hint">
          💡 Caesar cipher with unknown shift — try all 25 options
        </p>
      )}
      {difficulty === "hard" && <p className="hint">💡 {puzzle.hint}</p>}
      <input
        className="input"
        placeholder="Decrypted message"
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
