import { useRef, useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import { aiMove } from "./utils/aiMove";
import { WINNING_CONDITIONS } from "./utils/constants";

function App() {
  const [turn, setTurn] = useState<boolean>(true); // turn : true(X) false(O)
  const [winner, setWinner] = useState<string>(""); // either X or O
  const [squares, setSquares] = useState<string[]>(Array(9).fill(""));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [grid, setGrid] = useState<boolean[]>(Array(9).fill(false));
  const gridRef = useRef<HTMLDivElement>(null);
  const [winningBoxesIndex, setWinningBoxesIndex] = useState(Array(3).fill(0));
  const newSquares = squares;

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1,
  ];
  const trans: any = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });
  const resetButtonAppear = useSpring({
    marginLeft: gameOver ? 0 : -1500,
    config: { duration: 250 },
  });
  const resetButtonDisappear = useSpring({
    marginLeft: gameOver ? -1500 : 0,
    config: { duration: 250 },
  });

  const paintWinningBoxes = ([a, b, c]: number[]) => {
    if (gridRef && gridRef.current) {
      const paintBoxArray = Array.from(gridRef.current.childNodes);
      [a, b, c].forEach((eachWinningBox) => {
        let boxToPaint = paintBoxArray[eachWinningBox] as HTMLElement;
        !gameOver
          ? (boxToPaint.style.backgroundColor = "green")
          : (boxToPaint.style.backgroundColor = "transparent");
      });
    }
  };

  //main game board winner check
  const isGameOver = (results: string[]) => {
    WINNING_CONDITIONS.forEach((condition) => {
      const [x, y, z] = condition;
      if (
        results[x] &&
        results[x] === results[y] &&
        results[y] === results[z]
      ) {
        setWinner(results[x]);
        setWinningBoxesIndex([x, y, z]);
        setGameOver(!gameOver);
        paintWinningBoxes([x, y, z]);
      }
    });
    if (!squares.includes("") && !gameOver) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(""));
    setGameOver(false);
    setTurn(true);
    setGrid(Array(9).fill(false));
    setWinner("");
    paintWinningBoxes(winningBoxesIndex);
  };

  const handleClick = ({ target }: any) => {
    const boxIndex: number = target.getAttribute("data-grid");
    if (gameOver) return null;
    if (!grid[boxIndex]) {
      newSquares[boxIndex] = "X";
      setGrid({ ...grid, [boxIndex]: true });
      isGameOver(newSquares);
      setTurn(false);
    }
  };

  useEffect(() => {
    if (turn === false && gameOver === false) {
      aiMove(newSquares, setGrid, grid, 0);
      isGameOver(newSquares);
      setTurn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, grid, newSquares, turn]);

  return (
    <div className="App">
      <div className="main-container">
        <a.div className="grid-container" ref={gridRef} style={animation}>
          {squares.map((square, index) => {
            return (
              <a.div
                className="grid-item"
                key={index}
                data-grid={index}
                onClick={handleClick}
                onMouseMove={({ clientX: x, clientY: y }) =>
                  set({ xys: calc(x, y) })
                }
                onMouseLeave={() => set({ xys: [0, 0, 1] })}
                style={{
                  transform: props.xys.interpolate(trans),
                }}
              >
                {square}
              </a.div>
            );
          })}
        </a.div>
      </div>
      {gameOver && (
        <a.div
          className="bottom"
          style={gameOver ? resetButtonAppear : resetButtonDisappear}
        >
          <p className="winner-text">
            {!squares.includes("") && winner === ""
              ? "Draw!"
              : `${winner} has won!`}
          </p>
          <button className="resetButton" onClick={resetGame}>
            RESET
          </button>
        </a.div>
      )}
    </div>
  );
}
export default App;
