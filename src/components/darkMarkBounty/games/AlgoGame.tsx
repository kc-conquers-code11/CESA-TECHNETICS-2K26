import React, { useState } from "react";

interface Props {
  puzzle: {
    title: string;
    blocks: string[];
  };
  onAnswer: (correct: boolean) => void;
}

export const AlgoGame: React.FC<Props> = ({ puzzle, onAnswer }) => {
  const shuffled = [...puzzle.blocks].sort(() => Math.random() - 0.5);
  const [order, setOrder] = useState(shuffled);
  const [dragging, setDragging] = useState<number | null>(null);

  const dragStart = (i: number) => setDragging(i);

  const dragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const newOrder = [...order];
    const [item] = newOrder.splice(dragging, 1);
    newOrder.splice(i, 0, item);
    setOrder(newOrder);
    setDragging(i);
  };

  const check = () => {
    const correct = JSON.stringify(order) === JSON.stringify(puzzle.blocks);
    onAnswer(correct);
  };

  return (
    <div className="puzzle-box">
      <h2>Algorithm Order</h2>
      <p>
        Drag these steps into the correct order for{" "}
        <strong>{puzzle.title}</strong>:
      </p>
      <div className="algo-list">
        {order.map((block, i) => (
          <div
            key={block}
            className={`algo-block ${dragging === i ? "dragging" : ""}`}
            draggable
            onDragStart={() => dragStart(i)}
            onDragOver={(e) => dragOver(e, i)}
            onDragEnd={() => setDragging(null)}
          >
            <span className="algo-num">{i + 1}</span> {block}
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={check}>
        Verify Order
      </button>
    </div>
  );
};
