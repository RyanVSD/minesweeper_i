import React, { useEffect, useRef, useState } from "react";
import * as c from "./Constants";
import Square from "./Square";
import "./Board.css";
import { uuidv4 } from "@firebase/util";
import flag from "./images/flag.jpg";
import clock from "./images/clock.png";
import Timer from "./Timer.jsx";
import Dropdown from "./Dropdown.jsx";

export default function Board(props) {
  //Holds board data
  const [board, setBoard] = useState([]);
  //Records whether the first mine is clicked
  const [rows, setRows] = useState(14);
  const [cols, setCols] = useState(18);
  const [firstClick, setFirstClick] = useState(true);
  const [ids, setIds] = useState([]);
  const [mines, setMines] = useState(44);
  const [minePercent, setMinePercent] = useState(0.175);
  const [flagCount, setFlagCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [sizeMenu, setSizeMenu] = useState(false);
  const ref = useRef({});
  const timerRef = useRef(null);
  //Inits empty board
  useEffect(() => {
    const resetAll = () => {
      setFlagCount(0);
      setFirstClick(true);
      setGameOver(false);
      setWinner(false);

      let ar = [];
      for (var i = 0; i < rows; i++) {
        let row = [];
        ar.push(row);
      }
      for (i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          ar[i].push(c.CONSTANTS.Empty);
        }
      }
      setBoard(ar);
      let bar = [];
      for (i = 0; i < rows; i++) {
        let row = [];
        bar.push(row);
      }
      for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
          bar[i].push(uuidv4());
        }
      }
      setIds(bar);
    };
    resetAll();
    timerRef.current?.endTime();
  }, [cols, rows, mines]);

  const resetAll = () => {
    setFlagCount(0);
    setFirstClick(true);
    setGameOver(false);
    setWinner(false);

    let ar = [];
    for (var i = 0; i < rows; i++) {
      let row = [];
      ar.push(row);
    }
    for (i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        ar[i].push(c.CONSTANTS.Empty);
      }
    }
    setBoard(ar);
    let bar = [];
    for (i = 0; i < rows; i++) {
      let row = [];
      bar.push(row);
    }
    for (i = 0; i < rows; i++) {
      for (j = 0; j < cols; j++) {
        bar[i].push(uuidv4());
      }
    }
    setIds(bar);
    timerRef.current?.endTime();
  };

  function getGameOver() {
    return gameOver;
  }

  function incFlag(bool) {
    if (bool) {
      setFlagCount(flagCount + 1);
    } else {
      setFlagCount(flagCount - 1);
    }
  }

  //Returns col number of 1frs
  function getCols() {
    return "35px ".repeat(cols);
  }
  //Returns row number of 1frs
  function getRows() {
    return "35px ".repeat(rows);
  }

  function getRef(row, col) {
    return ref.current[row + " " + col];
  }

  function updateSquares() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ref.current[i + " " + j].updateValue(board[i][j]);
      }
    }
  }

  function generateMines(row, col) {
    let tempBoard = board;
    let i = 0;
    while (i < mines) {
      let newRow = getRandomInt(rows);
      let newCol = getRandomInt(cols);
      if (
        tempBoard[newRow][newCol] !== -1 &&
        (newRow !== row || newCol !== col) &&
        Math.abs(newRow - row) + Math.abs(newCol - col) > 3
      ) {
        for (var j = -1; j < 2; j++) {
          for (var k = -1; k < 2; k++) {
            tempBoard[newRow][newCol] = c.CONSTANTS.Mine;
            if (
              newRow + j < rows &&
              newRow + j >= 0 &&
              newCol + k < cols &&
              newCol + k >= 0 &&
              tempBoard[newRow + j][newCol + k] !== -1
            ) {
              tempBoard[newRow + j][newCol + k]++;
            }
          }
        }
        i++;
      }
    }
    setBoard(tempBoard);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  async function clickSquare(pos, first) {
    let row = pos.split(" ")[0];
    let col = pos.split(" ")[1];
    if (first) {
      timerRef.current.resetTime();
      timerRef.current.startTime();
      generateMines(row, col);
    }
    setFirstClick(false);
    let fromZero = 0;
    if (board[row][col] === 0) {
      fromZero += (await clearAdjacent(parseInt(row), parseInt(col))).valueOf();
      fromZero += (await updateSides()).valueOf();
      await updateFlags();
    }
    await updateSquares();
    if (checkWinner(1 + fromZero)) {
      setWinner(true);
      setGameOver(true);
      timerRef.current.endTime();
    }
  }

  async function updateSides() {
    let ticked = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (isAdjacentTo(i, j, 0) && !getRef(i, j).getStatus()) {
          getRef(i, j).reveal();
          ticked++;
          if (board[i][j] === 0) {
            clickSquare(i + " " + j, false);
          }
        }
      }
    }
    return ticked;
  }

  async function updateFlags() {
    let tempFlag = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (getRef(i, j).getFlagStatus()) {
          tempFlag++;
        }
      }
    }
    setFlagCount(tempFlag);
  }

  function isAdjacentTo(row, col, adjValue) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (inBounds(row + i, col + j)) {
          if (
            board[row + i][col + j] === 0 &&
            getRef(row + i, col + j).getStatus()
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function getWinner() {
    return winner;
  }

  function checkWinner() {
    let tempCheck = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (getRef(i, j).getStatus() && board[i][j] !== -1) {
          tempCheck++;
        }
      }
    }
    if (rows * cols - tempCheck <= mines) {
      return true;
    }
    return false;
  }

  function clickMine() {
    timerRef.current.endTime();
    setGameOver(true);
  }

  function setSize(size) {
    if (size === "small") {
      setRows(8);
      setCols(10);
      setMines(Math.floor(minePercent * 8 * 10));
    } else if (size === "medium") {
      setRows(14);
      setCols(18);
      setMines(Math.floor(minePercent * 14 * 18));
    } else if (size === "large") {
      setRows(20);
      setCols(24);
      setMines(Math.floor(minePercent * 20 * 24));
    }
    setSizeMenu(!sizeMenu);
  }

  async function clearAdjacent(row, col) {
    let ticked = 0;
    for (let i = -1; i < 2; i += 2) {
      if (col + i >= 0 && col + i < cols) {
        if (board[row][col + i] === 0 && !getRef(row, col + i).getStatus()) {
          await getRef(row, col + i).reveal();
          ticked++;
          ticked += (await clearAdjacent(row, col + i)).valueOf();
        }
      }

      if (row + i >= 0 && row + i < rows) {
        if (board[row + i][col] === 0 && !getRef(row + i, col).getStatus()) {
          await getRef(row + i, col).reveal();
          ticked++;
          ticked += (await clearAdjacent(row + i, col)).valueOf();
        }
      }
    }
    return ticked;
  }

  function inBounds(row, col) {
    return row >= 0 && col >= 0 && col < cols && row < rows;
  }

  function clickAround(row, col) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (inBounds(row + i, col + j)) {
          if (!getRef(row + i, col + j).getStatus()) {
            getRef(row + i, col + j).click();
          }
        }
      }
    }
  }

  return (
    <div
      className="board"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <button className="new-game-button" onClick={() => resetAll()}>
        New Game
      </button>
      <div className="game">
        <div className="top-bar">
          {gameOver ? (
            <div className="game-over-text">
              {winner ? "You win!" : "You lose"}
            </div>
          ) : (
            <></>
          )}
          <img className="flag-logo" src={flag} alt="flags" />
          <div className="flag-count">{mines - flagCount}</div>
          <img className="clock-image" src={clock} alt="clock" />
          <Timer ref={(e) => (timerRef.current = e)} />
          <Dropdown
            open={sizeMenu}
            trigger={
              <button onClick={() => setSizeMenu(!sizeMenu)}>
                {" "}
                Change size{" "}
              </button>
            }
            menu={[
              <button onClick={() => setSize("small")}>Small</button>,
              <button onClick={() => setSize("medium")}>Medium</button>,
              <button onClick={() => setSize("large")}>Large</button>,
            ]}
          />
        </div>
        <div
          className="main-board"
          style={{ display: "grid", gridTemplateRows: getRows() }}
        >
          {board.map((row, rowInd) => {
            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getCols(),
                  columnGap: "0px",
                }}
              >
                {row.map((item, colInd) => {
                  return (
                    <Square
                      key={ids[rowInd][colInd]}
                      revealed={false}
                      value={board[rowInd][colInd]}
                      row={rowInd}
                      col={colInd}
                      ref={(element) => {
                        if (element) {
                          ref.current[rowInd + " " + colInd] = element;
                        } else {
                          delete ref.current[rowInd + " " + colInd];
                        }
                      }}
                      onClick={(pos) => clickSquare(pos, firstClick)}
                      onRight={(bool) => incFlag(bool)}
                      clickMine={() => clickMine()}
                      isGameOver={() => getGameOver()}
                      isWinner={() => getWinner()}
                      clickAround={(row, col) => {
                        clickAround(row, col);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
