import React, { useEffect, useRef, useState } from "react";
import * as c from "./Constants";
import Square from "./Square";
import "./Board.css";
import { uuidv4 } from "@firebase/util";
import flag from "./images/flag.jpg";
import imflag from "./images/imaginaryFlag.png";
import clock from "./images/clock.png";
import Timer from "./Timer.jsx";
import Dropdown from "./Dropdown.jsx";
import reversal from "./images/reversal.png";

export default function Board(props) {
	//Holds board data
	const [board, setBoard] = useState([]);
	const [imaginaryBoard, setImaginaryBoard] = useState([]);
	const [rows, setRows] = useState(10);
	const [cols, setCols] = useState(14);
	//first click
	const [firstClick, setFirstClick] = useState(true);
	//imaginary stuff
	const [imids, setImids] = useState([]);
	const [imRevealed, setImRevealed] = useState([]);
	const imref = useRef({});
	const [imFlagCount, setImFlagCount] = useState(35);
	//regular stuff
	const [ids, setIds] = useState([]);
	const [mines, setMines] = useState(35);
	const [minePercent, setMinePercent] = useState(0.25);
	const ref = useRef({});
	const [flagCount, setFlagCount] = useState(35);
	//game state stuff
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(false);
	const [loser, setLoser] = useState(false);
	const [sizeMenu, setSizeMenu] = useState(false);
	const timerRef = useRef(null);
	const [imaginaryView, setImaginaryView] = useState(false);

	const arr2D = (r, c, x) => {
		var arr = [];
		for (let i = 0; i < r; i++) {
			arr[i] = [];
			for (let j = 0; j < c; j++) {
				arr[i][j] = x;
			}
		}
		return arr;
	};

	const arr2DID = (r, c) => {
		var arr = [];
		for (let i = 0; i < r; i++) {
			arr[i] = [];
			for (let j = 0; j < c; j++) {
				arr[i][j] = uuidv4();
			}
		}
		return arr;
	};

	//Inits empty board
	useEffect(() => {
		const resetAll = () => {
			setFirstClick(true);
			setFlagCount(mines);
			setImFlagCount(mines);
			setGameOver(false);
			setWinner(false);
			setLoser(false);
			setImaginaryView(false);
			setBoard(arr2D(rows, cols, c.CONSTANTS.Empty));
			setImaginaryBoard(arr2D(rows, cols, c.CONSTANTS.Empty));
			setIds(arr2DID(rows, cols));
			setImids(arr2DID(rows, cols));
		};
		resetAll();
		timerRef.current?.endTime();
	}, [cols, rows, mines]);

	useEffect(() => {
		timerRef.current?.endTime();
	}, [ids, imids]);

	const resetAll = () => {
		setFirstClick(true);
		setGameOver(false);
		setWinner(false);
		setLoser(false);
		setFlagCount(mines);
		setImFlagCount(mines);
		setImaginaryView(false);
		setBoard(arr2D(rows, cols, c.CONSTANTS.Empty));
		setImaginaryBoard(arr2D(rows, cols, c.CONSTANTS.Empty));
		setIds(arr2DID(rows, cols));
		setImids(arr2DID(rows, cols));
		timerRef.current?.endTime();
	};

	function getGameOver() {
		return gameOver;
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

	function getImRef(row, col) {
		return imref.current[row + " " + col];
	}

	function updateSquares() {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				ref.current[i + " " + j]?.updateValue(
					getSquareText(i, j, false)
				);
			}
		}
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				imref.current[i + " " + j]?.updateValue(
					getSquareText(i, j, true)
				);
			}
		}
	}

	function incFlag(f) {
		console.log("incing flag");
		if (f) {
			setFlagCount(flagCount + 1);
		} else {
			setFlagCount(flagCount - 1);
		}
	}

	function incImFlag(f) {
		if (f) {
			setImFlagCount(imFlagCount + 1);
		} else {
			setImFlagCount(imFlagCount - 1);
		}
	}

	function getSquareText(row, col, imaginary) {
		let num = board[row][col];
		let inum = imaginaryBoard[row][col];
		if (imaginary) {
			if (inum < 0) {
				return inum;
			}
		} else {
			if (num < 0) {
				return num;
			}
		}
		if (num > 0 && inum > 0) {
			return num + " + " + inum + "i";
		} else if (num === 0 && inum > 0) {
			return inum + "i";
		} else if (num > 0 && inum === 0) {
			return num;
		}

		if (imaginary) {
			if (num < 0) {
				let mine = 0;
				for (var i = -1; i < 2; i++) {
					for (var j = -1; j < 2; j++) {
						if (inBounds(row + i, col + j)) {
							if (board[row + i][col + j] === -1) {
								mine += 1;
							}
						}
					}
				}
				if (mine > 0 && inum > 0) {
					return mine + " + " + inum + "i";
				} else if (num === 0) {
					return inum + "i";
				} else {
					return mine;
				}
			}
		} else {
			if (inum < 0) {
				let imine = 0;
				for (i = -1; i < 2; i++) {
					for (j = -1; j < 2; j++) {
						if (inBounds(row + i, col + j)) {
							if (imaginaryBoard[row + i][col + j] === -1) {
								imine += 1;
							}
						}
					}
				}
				if (imine > 0 && num > 0) {
					return num + " + " + imine + "i";
				} else if (num === 0) {
					return imine + "i";
				} else {
					return num;
				}
			}
		}
	}

	function generateMines(row, col) {
		let tempBoard = board.slice();
		let i = 0;
		while (i < mines) {
			let newRow = getRandomInt(rows);
			let newCol = getRandomInt(cols);
			if (
				tempBoard[newRow][newCol] !== -1 &&
				(newRow !== row || newCol !== col) &&
				Math.abs(newRow - row) + Math.abs(newCol - col) >
					(imaginaryView ? 0 : 3)
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
		let tempImBoard = imaginaryBoard.slice();
		i = 0;
		while (i < mines) {
			let newRow = getRandomInt(rows);
			let newCol = getRandomInt(cols);
			if (
				tempImBoard[newRow][newCol] !== -1 &&
				(newRow !== row || newCol !== col) &&
				Math.abs(newRow - row) + Math.abs(newCol - col) >
					(imaginaryView ? 3 : 0)
			) {
				for (j = -1; j < 2; j++) {
					for (k = -1; k < 2; k++) {
						tempImBoard[newRow][newCol] = c.CONSTANTS.Mine;
						if (
							newRow + j < rows &&
							newRow + j >= 0 &&
							newCol + k < cols &&
							newCol + k >= 0 &&
							tempImBoard[newRow + j][newCol + k] !== -1
						) {
							tempImBoard[newRow + j][newCol + k]++;
						}
					}
				}
				i++;
			}
		}

		setImaginaryBoard(tempImBoard);
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	async function clickSquare(pos, first, im) {
		let row = pos.split(" ")[0];
		let col = pos.split(" ")[1];
		if (first) {
			timerRef.current.resetTime();
			timerRef.current.startTime();
			generateMines(row, col);
			setFirstClick(false);
			first = false;
			clickSquare(pos, first, im);
		}
		await updateSquares();
		if (checkWinner()) {
			setWinner(true);
			setGameOver(true);
			timerRef.current.endTime();
		}
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
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (getImRef(i, j).getStatus() && imaginaryBoard[i][j] !== -1) {
					tempCheck++;
				}
			}
		}
		if (2 * rows * cols - tempCheck <= 2 * mines) {
			return true;
		}
		return false;
	}

	function clickMine() {
		setGameOver(true);
		setLoser(true);
		timerRef.current.endTime();
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				getRef(i, j).reveal();
				getImRef(i, j).reveal();
			}
		}
	}

	function setSize(size) {
		if (size === "small") {
			setRows(6);
			setCols(8);
			setMines(Math.floor(minePercent * 6 * 8));
		} else if (size === "medium") {
			setRows(10);
			setCols(14);
			setMines(Math.floor(minePercent * 10 * 14));
		} else if (size === "large") {
			setRows(14);
			setCols(18);
			setMines(Math.floor(minePercent * 14 * 18));
		}
		setSizeMenu(!sizeMenu);
	}

	function setDifficulty(diff) {
		if (diff === "easy") {
			setMinePercent(0.175);
			setMines(Math.floor(rows * cols * 0.175));
		} else if (diff === "medium") {
			setMinePercent(0.25);
			setMines(Math.floor(rows * cols * 0.25));
		} else if (diff === "hard") {
			setMinePercent(0.35);
			setMines(Math.floor(rows * cols * 0.35));
		}
		setSizeMenu(!sizeMenu);
	}

	function inBounds(row, col) {
		return row >= 0 && col >= 0 && col < cols && row < rows;
	}

	async function clickAround(row, col, im) {
		row = parseInt(row);
		col = parseInt(col);
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (inBounds(row + i, col + j)) {
					if (im) {
						if (!getImRef(row + i, col + j).getStatus()) {
							getImRef(row + i, col + j)?.click();
						}
					} else {
						if (!getRef(row + i, col + j).getStatus()) {
							await getRef(row + i, col + j).click();
						}
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
			<div className="game">
				<div className="game-title">Minesweeper</div>
				<div className="author">By Ryan Virtue</div>
				<div className="top-bar">
					<Dropdown
						open={sizeMenu}
						trigger={
							<button
								className="menu-button"
								onClick={() => setSizeMenu(!sizeMenu)}
							>
								Change settings
							</button>
						}
						menu={[
							<div> Size </div>,
							<button onClick={() => setSize("small")}>
								Small
							</button>,
							<button onClick={() => setSize("medium")}>
								Medium
							</button>,
							<button onClick={() => setSize("large")}>
								Large
							</button>,
							<div> Difficulties </div>,
							<button onClick={() => setDifficulty("easy")}>
								Easy
							</button>,
							<button onClick={() => setDifficulty("medium")}>
								Medium
							</button>,
							<button onClick={() => setDifficulty("hard")}>
								Hard
							</button>,
						]}
					/>
					<button className="menu-button" onClick={() => resetAll()}>
						New Game
					</button>
					<button
						className="menu-button"
						onClick={() => {
							props.openChangelogs();
						}}
					>
						Open Change Logs
					</button>
				</div>
				<div className="top-bar">
					{gameOver ? (
						<div className="game-over-text">
							{!loser ? "You win!" : "You lose"}
						</div>
					) : (
						<></>
					)}

					{imaginaryView ? (
						<div style={{ display: "flex", alignItems: "center" }}>
							<img
								className="flag-logo"
								src={imflag}
								alt="flags"
							/>
							<div className="flag-count">{imFlagCount}</div>
						</div>
					) : (
						<div style={{ display: "flex", alignItems: "center" }}>
							<img className="flag-logo" src={flag} alt="flags" />
							<div className="flag-count">{flagCount}</div>
						</div>
					)}

					<img className="clock-image" src={clock} alt="clock" />
					<Timer ref={(e) => (timerRef.current = e)} />
					<img
						className="imagine-swap"
						src={reversal}
						alt="imagine"
						onClick={() => {
							setImaginaryView(!imaginaryView);
						}}
					/>
				</div>
				<div
					className={imaginaryView ? "main-board" : "hide"}
					style={
						!imaginaryView
							? { width: "0px" }
							: { display: "grid", gridTemplateRows: getRows() }
					}
				>
					{board.map((row, rowInd) => {
						return (
							<div
								style={
									!imaginaryView
										? {}
										: {
												display: "grid",
												gridTemplateColumns: getCols(),
												columnGap: "0px",
										  }
								}
							>
								{row.map((item, colInd) => {
									return (
										<Square
											key={imids[rowInd][colInd]}
											revealed={false}
											value={
												imaginaryBoard[rowInd][colInd]
											}
											hidden={!imaginaryView}
											imaginary={true}
											row={rowInd}
											col={colInd}
											ref={(element) => {
												if (element) {
													imref.current[
														rowInd + " " + colInd
													] = element;
												} else {
													delete imref.current[
														rowInd + " " + colInd
													];
												}
											}}
											onClick={(pos) =>
												clickSquare(
													pos,
													firstClick,
													true
												)
											}
											incFlag={(inc) => incImFlag(inc)}
											clickMine={() => clickMine()}
											isGameOver={() => getGameOver()}
											isWinner={() => getWinner()}
											imView={() => {
												return imaginaryView;
											}}
											clickAround={(row, col) => {
												clickAround(row, col, true);
											}}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
				<div
					className={imaginaryView ? "hide" : "main-board"}
					style={
						imaginaryView
							? {}
							: { display: "grid", gridTemplateRows: getRows() }
					}
				>
					{board.map((row, rowInd) => {
						return (
							<div
								style={
									imaginaryView
										? {}
										: {
												display: "grid",
												gridTemplateColumns: getCols(),
												columnGap: "0px",
										  }
								}
							>
								{row.map((item, colInd) => {
									return (
										<Square
											key={ids[rowInd][colInd]}
											revealed={false}
											value={board[rowInd][colInd]}
											row={rowInd}
											col={colInd}
											hidden={imaginaryView}
											imaginary={false}
											ref={(element) => {
												if (element) {
													ref.current[
														rowInd + " " + colInd
													] = element;
												} else {
													delete ref.current[
														rowInd + " " + colInd
													];
												}
											}}
											onClick={(pos) =>
												clickSquare(
													pos,
													firstClick,
													false
												)
											}
											incFlag={(inc) => incFlag(inc)}
											clickMine={() => clickMine()}
											isGameOver={() => getGameOver()}
											isWinner={() => getWinner()}
											imView={() => {
												return imaginaryView;
											}}
											clickAround={(row, col) => {
												clickAround(row, col, false);
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
