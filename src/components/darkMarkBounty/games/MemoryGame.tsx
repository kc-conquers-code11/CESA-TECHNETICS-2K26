import React, { useState, useEffect } from "react";
import type { Difficulty } from "@/components/data/darkMarkBounty/envelopeCodes";

interface Props {
  puzzle: {
    pairs: [string, string][];
    facts: Record<string, string>;
  };
  difficulty: Difficulty;
  onAnswer: (correct: boolean) => void;
}

export const MemoryGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const pairs = puzzle.pairs;
  const allCards = [...pairs.map(([a]) => a), ...pairs.map(([, b]) => b)].sort(
    () => Math.random() - 0.5,
  );
  const [cards, setCards] = useState(
    allCards.map((v, i) => ({
      id: i,
      value: v,
      flipped: false,
      matched: false,
    })),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [fact, setFact] = useState("");
  const [locked, setLocked] = useState(false);

  const flip = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );

    if (newSelected.length === 2) {
      setLocked(true);
      const [a, b] = newSelected.map((id) => cards.find((c) => c.id === id)!);
      const matchedPair = pairs.find(
        ([x, y]) =>
          (a.value === x && b.value === y) || (a.value === y && b.value === x),
      );

      if (matchedPair) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, matched: true } : c,
            ),
          );
          setFact(puzzle.facts[matchedPair[0]] || "");
          setSelected([]);
          setLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c,
            ),
          );
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    } else {
      setSelected(newSelected);
    }
  };

  const matchedCount = cards.filter((c) => c.matched).length;
  const total = cards.length;

  useEffect(() => {
    if (matchedCount === total && total > 0) {
      setTimeout(() => onAnswer(true), 800);
    }
  }, [matchedCount, total, onAnswer]);

  const gridCols = pairs.length <= 6 ? 4 : pairs.length <= 10 ? 5 : 6;

  return (
    <div className="puzzle-box memory-box">
      <h2>Memory Match</h2>
      <div className="memory-progress">
        {matchedCount / 2}/{total / 2} pairs matched
      </div>
      {fact && <div className="memory-fact">✨ {fact}</div>}
      <div
        className="memory-grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`mem-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
            onClick={() => flip(card.id)}
          >
            {card.flipped || card.matched ? card.value : "?"}
          </div>
        ))}
      </div>
    </div>
  );
};
