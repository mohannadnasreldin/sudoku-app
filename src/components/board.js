// src/components/Board.js
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { generatePuzzle } from "../utils/generatePuzzles";
import Controls from "./controls";
import Cell from "./cell";

const Board = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [initialPuzzle, setInitialPuzzle] = useState([]);
  const [invalidCells, setInvalidCells] = useState([]); // Track invalid cells
  const [isSolved, setIsSolved] = useState(null); // Track whether the solution is valid or not
  const [difficulty, setDifficulty] = useState("easy"); // Handle difficulty selection
  const boardRef = useRef(null);

  // Generate or reset the puzzle when difficulty changes or when puzzle is reset
  useEffect(() => {
    generateNewPuzzle(difficulty);
  }, [difficulty]);

  const generateNewPuzzle = (difficulty) => {
    const newPuzzle = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setInitialPuzzle(JSON.parse(JSON.stringify(newPuzzle))); // Save the initial puzzle state
    setInvalidCells([]); // Reset invalid cells
    setIsSolved(null); // Reset solution check

    // Trigger the animation only when the puzzle is generated or reset
    gsap.fromTo(
      boardRef.current.children,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }
    );
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const resetPuzzle = () => {
    setPuzzle(JSON.parse(JSON.stringify(initialPuzzle))); // Reset to the initial puzzle state
    setInvalidCells([]); // Clear invalid cells
    setIsSolved(null); // Clear solution check
    gsap.fromTo(
      boardRef.current.children,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }
    ); // Animation on reset
  };

  const handleInputChange = (row, col, value) => {
    const updatedPuzzle = [...puzzle];
    updatedPuzzle[row][col] = value === "" ? null : parseInt(value);
    setPuzzle(updatedPuzzle);

    // Validate the input and check the solution after every change
    validateInput(updatedPuzzle, row, col, parseInt(value));
    checkSolution(updatedPuzzle);
  };

  const validateInput = (puzzle, row, col, value) => {
    if (value === null || isNaN(value)) return; // Skip validation for empty cells

    let isValid = true;

    // Check row and column for conflicts
    for (let i = 0; i < 9; i++) {
      if (i !== col && puzzle[row][i] === value) isValid = false;
      if (i !== row && puzzle[i][col] === value) isValid = false;
    }

    // Check the 3x3 grid for conflicts
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        if ((r !== row || c !== col) && puzzle[r][c] === value) {
          isValid = false;
        }
      }
    }

    if (!isValid) {
      setInvalidCells([...invalidCells, { row, col }]);
    } else {
      setInvalidCells(invalidCells.filter(cell => !(cell.row === row && cell.col === col)));
    }
  };

  const checkSolution = (updatedPuzzle) => {
    const allCellsFilled = updatedPuzzle.every(row => row.every(cell => cell !== null));
    if (!allCellsFilled) {
      setIsSolved(false); // Puzzle is not solved if any cell is empty
      return;
    }

    const isValidSolution = validatePuzzleSolution(updatedPuzzle);
    setIsSolved(isValidSolution);
  };

  const validatePuzzleSolution = (puzzle) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = puzzle[row][col];
        const puzzleCopy = JSON.parse(JSON.stringify(puzzle)); // Copy puzzle for validation
        puzzleCopy[row][col] = null; // Temporarily clear the current cell for validation

        let isValid = true;

        for (let i = 0; i < 9; i++) {
          if (i !== col && puzzleCopy[row][i] === value) isValid = false;
          if (i !== row && puzzleCopy[i][col] === value) isValid = false;
        }

        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;
        for (let r = boxRowStart; r < boxRowStart + 3; r++) {
          for (let c = boxColStart; c < boxColStart + 3; c++) {
            if ((r !== row || c !== col) && puzzleCopy[r][c] === value) {
              isValid = false;
            }
          }
        }

        if (!isValid) {
          return false;
        }
      }
    }
    return true;
  };

  const renderCells = () => {
    return puzzle.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const editable = initialPuzzle[rowIndex][colIndex] === null;
        const isInvalid = invalidCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
        return (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={value}
            editable={editable}
            isInvalid={isInvalid}
            onChange={(inputValue) => handleInputChange(rowIndex, colIndex, inputValue)}
          />
        );
      })
    );
  };

  return (
    <div className="flex flex-col items-center">
      <Controls onDifficultyChange={handleDifficultyChange} resetPuzzle={resetPuzzle} />
      <div className="grid grid-cols-9 gap-1 p-4" ref={boardRef}>
        {renderCells()}
      </div>
      {isSolved === true && (
        <div className="text-green-600 font-bold mt-4">Congratulations! The puzzle is solved correctly!</div>
      )}
      {isSolved === false && (
        <div className="text-red-600 font-bold mt-4">Oops! The puzzle is not solved correctly.</div>
      )}
    </div>
  );
};

export default Board;
