export const generatePuzzle = (difficulty) => {
    const basePuzzle = generateSolvedGrid();
    const puzzle = removeNumbersForDifficulty(basePuzzle, difficulty);
    return puzzle;
  };
  
  // Generate a fully solved Sudoku grid using backtracking
  const generateSolvedGrid = () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(null));
  
    const isValid = (grid, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
  
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;
        if (grid[boxRowStart + Math.floor(i / 3)][boxColStart + (i % 3)] === num) return false;
      }
      return true;
    };
  
    const fillGrid = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === null) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (let num of numbers) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (fillGrid(grid)) {
                  return true;
                }
                grid[row][col] = null;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  
    fillGrid(grid);
    return grid;
  };
  
  // Shuffle the numbers array (Fisher-Yates algorithm)
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  // Remove numbers from the solved puzzle based on difficulty
  const removeNumbersForDifficulty = (puzzle, difficulty) => {
    let emptyCells;
    switch (difficulty) {
      case "easy":
        emptyCells = 40;
        break;
      case "medium":
        emptyCells = 50;
        break;
      case "hard":
        emptyCells = 60;
        break;
      default:
        emptyCells = 40;
    }
  
    const puzzleCopy = JSON.parse(JSON.stringify(puzzle)); // Clone the puzzle array
  
    for (let i = 0; i < emptyCells; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzleCopy[row][col] !== null) {
        puzzleCopy[row][col] = null; // Remove number
      } else {
        i--; // Retry if already empty
      }
    }
    return puzzleCopy;
  };
  