// src/components/Controls.js
import React from "react";

const Controls = ({ onDifficultyChange, resetPuzzle }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => onDifficultyChange("easy")}
      >
        Easy
      </button>
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded"
        onClick={() => onDifficultyChange("medium")}
      >
        Medium
      </button>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded"
        onClick={() => onDifficultyChange("hard")}
      >
        Hard
      </button>
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded"
        onClick={resetPuzzle}
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
