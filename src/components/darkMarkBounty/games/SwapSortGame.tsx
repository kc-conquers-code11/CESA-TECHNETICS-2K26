import React, { useState } from "react";

interface Props {
  puzzle: {
    arr: number[];
    sorted: number[];
    minSwaps: number;
    hint: string;
  };
  onAnswer: (correct: boolean) => void;
}

export const SwapSortGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const [arr, setArr] = useState([...puzzle.arr]);
  const [swaps, setSwaps] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const isSorted = (a: number[]) =>
    JSON.stringify(a) === JSON.stringify(puzzle.sorted);

  const handleClick = (i: number) => {
    if (done) return;

    if (selected === null) {
      setSelected(i);
    } else {
      if (selected !== i) {
        const newArr = [...arr];
        [newArr[selected], newArr[i]] = [newArr[i], newArr[selected]];
        const newSwaps = swaps + 1;
        setArr(newArr);
        setSwaps(newSwaps);
        setSelected(null);

        if (isSorted(newArr)) {
          setDone(true);
          setTimeout(() => onAnswer(newSwaps <= puzzle.minSwaps), 600);
        }
      } else {
        setSelected(null);
      }
    }
  };

  return (
    <div className="puzzle-box">
      <h2>Minimum Swap Sort</h2>
      <p>
        Sort this array using <strong>at most {puzzle.minSwaps} swaps</strong>.
        Click two numbers to swap them.
      </p>
      <div className="swap-target">Target: [{puzzle.sorted.join(", ")}]</div>
      <div className="swap-array">
        {arr.map((n, i) => (
          <div
            key={i}
            className={`swap-num ${selected === i ? "swap-selected" : ""} ${done && puzzle.sorted[i] === n ? "swap-ok" : ""}`}
            onClick={() => handleClick(i)}
          >
            {n}
          </div>
        ))}
      </div>
      <div className="swap-info">
        Swaps used:{" "}
        <strong
          style={{ color: swaps > puzzle.minSwaps ? "#ff4444" : "#00ff88" }}
        >
          {swaps}
        </strong>{" "}
        / {puzzle.minSwaps} max
      </div>
      {done && (
        <div className="memory-fact" style={{ marginTop: 12 }}>
          ✅ Sorted in {swaps} swaps!
        </div>
      )}
      <p className="hint">💡 {puzzle.hint}</p>
    </div>
  );
};
