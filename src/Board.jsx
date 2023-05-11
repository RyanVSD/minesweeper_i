import React, { useEffect, useRef, useState } from "react";
import * as c from "./Constants";
import Square from "./Square";
import "./Board.css";
import { uuidv4 } from "@firebase/util";

export default function Board(props) {
  //Holds board data
  const [board, setBoard] = useState([]);
  //Records whether the first mine is clicked
  const [firstClick, setFirstClick] = useState(false);
  const [ids, setIds] = useState([]);
  const ref = useRef({});
  //Inits empty board
  useEffect(() => {
    let ar = [];
    for (var i = 0; i < props.cols; i++) {
      let row = [];
      ar.push(row);
    }
    for (i = 0; i < props.cols; i++) {
      for (var j = 0; j < props.rows; j++) {
        ar[i].push(c.CONSTANTS.Empty);
      }
    }
    setBoard(ar);
    let bar = [];
    for (i = 0; i < props.cols; i++) {
      let row = [];
      bar.push(row);
    }
    for (i = 0; i < props.cols; i++) {
      for (j = 0; j < props.rows; j++) {
        bar[i].push(uuidv4());
      }
    }
    setIds(bar);
  }, [props.cols, props.rows, props.mines]);

  //Returns col number of 1frs
  function getCols() {
    return "1fr ".repeat(props.cols);
  }
  //Returns row number of 1frs
  function getRows() {
    return "1fr ".repeat(props.rows);
  }

  function updateSquares() {
    for (let i = 0; i < props.rows; i++) {
      for (let j = 0; j < props.rows; j++) {
        console.log(ref.current[i + " " + j].updateValue(board[i][j]));
      }
    }
  }

  function generateMines(row, col) {
    console.log("genning");
    let tempBoard = board;
    let i = 0;
    while (i < props.mines) {
      let newRow = getRandomInt(props.rows);
      let newCol = getRandomInt(props.cols);
      if (
        tempBoard[newRow][newCol] === 0 &&
        (newRow !== row || newCol !== col)
      ) {
        console.log("adding mine at: " + newRow + " " + newCol);
        tempBoard[newRow][newCol] = c.CONSTANTS.Mine;
        i++;
      }
    }
    console.log(tempBoard);
    setBoard(tempBoard);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function clickSquare(pos) {
    let row = pos.split(" ")[0];
    let col = pos.split(" ")[1];
    if (!firstClick) {
      generateMines(row, col);
    }
  }

  return (
    <div className="board">
      I am board with {props.cols} columns and {props.rows} rows with{" "}
      {props.mines} mines resulting in a mine percent of{" "}
      {Math.round((props.mines / (props.rows * props.cols)) * 1000) / 10 + "%"}
      <div
        className="main-board"
        style={{ display: "grid", gridTemplateColumns: getCols() }}
      >
        {board.map((row, rowInd) => {
          return (
            <div style={{ display: "grid", gridTemplateRows: getRows() }}>
              {row.map((item, colInd) => {
                return (
                  <Square
                    key={ids[rowInd][colInd]}
                    revealed={true}
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
                    onClick={(pos) => clickSquare(pos)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <button onClick={() => updateSquares()}>logarithm</button>
    </div>
  );
}
