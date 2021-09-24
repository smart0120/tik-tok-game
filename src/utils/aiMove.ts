import { WINNING_CONDITIONS } from "./constants";

const checkWinner = (board: string[]) => {
    let result = null;
    for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
      const [x, y, z] = WINNING_CONDITIONS[i];
      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        if (board[x] === "X") {
          return (result = 10);
        } else{
          return (result = -10);
        }
      } else if (!board.includes("")) return result = 0;
    }
    return result;
}

  const minimax = (tempSquares: string[], isMinimizing: boolean,depth:number) => {
    let result = checkWinner(tempSquares);
    if (result !== null) {
      return result;
    }
    if (isMinimizing) {
      let bestScore = Infinity;
      for (let i = 0; i < tempSquares.length; i++) {
        if (tempSquares[i] === "") {
          tempSquares[i] = "O";
          let score = minimax(tempSquares, false,depth+1);
          tempSquares[i] = "";
          score += depth
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = -Infinity;
      for (let i = 0; i < tempSquares.length; i++) {
        if (tempSquares[i] === "") {
          tempSquares[i] = "X";
          let score = minimax(tempSquares, true,depth+1);
          tempSquares[i] = "";
          score -= depth
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    }
  };

 export const aiMove = (squareAi: string[],setGrid :React.Dispatch<React.SetStateAction<boolean[]>>,grid:boolean[] , depth:number) => {
    let bestScore = Infinity;
    let indexToPlay = null;
    for (let i = 0; i < squareAi.length; i++) {
      if (squareAi[i] === "") {
        squareAi[i] = "O";
        let score = minimax(squareAi, false,depth+1);
        squareAi[i] = "";
        if (score < bestScore) {
          bestScore = score;
          indexToPlay = i;
        }
      }
    }
    if (indexToPlay !== null) {
      squareAi[indexToPlay] = "O";
      setGrid({ ...grid, [indexToPlay]: true });
    }
  };