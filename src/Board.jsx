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
	const [rows, setRows] = useState(14);
	const [cols, setCols] = useState(18);
	//first click
	const [firstClick, setFirstClick] = useState(true);
	//imaginary stuff
	const [imids, setImids] = useState([]);
	const [imFlagCount, setImFlagCount] = useState(0);
	const [imMines, setImMines] = useState(44);
	const imref = useRef({});
	//regular stuff
	const [ids, setIds] = useState([]);
	const [flagCount, setFlagCount] = useState(0);
	const [mines, setMines] = useState(44);
	const [minePercent, setMinePercent] = useState(0.175);
	const ref = useRef({});
	//game state stuff
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(false);
	const [sizeMenu, setSizeMenu] = useState(false);
	const timerRef = useRef(null);
	const [imaginaryView, setImaginaryView] = useState(false);
	//Inits empty board
	useEffect(() => {
		const resetAll = () => {
			setFlagCount(0);
			setImFlagCount(0);
			setFirstClick(true);
			setGameOver(false);
			setWinner(false);
			setImaginaryView(false);

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
			let fr = [];
			for (i = 0; i < rows; i++) {
				let row = [];
				fr.push(row);
			}
			for (i = 0; i < rows; i++) {
				for (j = 0; j < cols; j++) {
					fr[i].push(c.CONSTANTS.Empty);
				}
			}
			setImaginaryBoard(fr);
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
			bar = [];
			for (i = 0; i < rows; i++) {
				let row = [];
				bar.push(row);
			}
			for (i = 0; i < rows; i++) {
				for (j = 0; j < cols; j++) {
					bar[i].push(uuidv4());
				}
			}
			setImids(bar);
		};
		resetAll();
		timerRef.current?.endTime();
	}, [cols, rows, mines]);

	const resetAll = () => {
		setFlagCount(0);
		setImFlagCount(0);
		setFirstClick(true);
		setGameOver(false);
		setWinner(false);
		setImaginaryView(false);

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
		let fr = [];
		for (i = 0; i < rows; i++) {
			let row = [];
			fr.push(row);
		}
		for (i = 0; i < rows; i++) {
			for (j = 0; j < cols; j++) {
				fr[i].push(c.CONSTANTS.Empty);
			}
		}
		setImaginaryBoard(fr);
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
		bar = [];
		for (i = 0; i < rows; i++) {
			let row = [];
			bar.push(row);
		}
		for (i = 0; i < rows; i++) {
			for (j = 0; j < cols; j++) {
				bar[i].push(uuidv4());
			}
		}
		setImids(bar);
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

	function incImFlag(bool) {
		if (bool) {
			setImFlagCount(imFlagCount + 1);
		} else {
			setImFlagCount(imFlagCount - 1);
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
		//console.log(row, col, imaginary, nmines, imines);
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
		let tempBoard = board;
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
		let tempImBoard = imaginaryBoard;
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
			fromZero += (
				await clearAdjacent(parseInt(row), parseInt(col))
			).valueOf();
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

	async function clickImSquare(pos, first) {
		let row = pos.split(" ")[0];
		let col = pos.split(" ")[1];
		if (first) {
			timerRef.current.resetTime();
			timerRef.current.startTime();
			generateMines(row, col);
		}
		setFirstClick(false);
		let fromZero = 0;
		if (imaginaryBoard[row][col] === 0) {
			fromZero += (
				await clearImAdjacent(parseInt(row), parseInt(col))
			).valueOf();
			fromZero += (await updateImSides()).valueOf();
			await updateImFlags();
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

	async function updateImSides() {
		let ticked = 0;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (isImAdjacentTo(i, j, 0) && !getImRef(i, j).getStatus()) {
					getImRef(i, j).reveal();
					ticked++;
					if (imaginaryBoard[i][j] === 0) {
						clickImSquare(i + " " + j, false);
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
	async function updateImFlags() {
		let tempFlag = 0;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (getImRef(i, j).getFlagStatus()) {
					tempFlag++;
				}
			}
		}
		setImFlagCount(tempFlag);
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

	function isImAdjacentTo(row, col, adjValue) {
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (inBounds(row + i, col + j)) {
					if (
						imaginaryBoard[row + i][col + j] === 0 &&
						getImRef(row + i, col + j).getStatus()
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
		timerRef.current.endTime();
		setGameOver(true);
	}

	function setSize(size) {
		if (size === "small") {
			setRows(8);
			setCols(10);
			setMines(Math.floor(minePercent * 8 * 10));
			setImMines(Math.floor(minePercent * 8 * 10));
		} else if (size === "medium") {
			setRows(14);
			setCols(18);
			setMines(Math.floor(minePercent * 14 * 18));
			setImMines(Math.floor(minePercent * 14 * 18));
		} else if (size === "large") {
			setRows(20);
			setCols(24);
			setMines(Math.floor(minePercent * 20 * 24));
			setImMines(Math.floor(minePercent * 20 * 24));
		}
		setSizeMenu(!sizeMenu);
	}

	function setDifficulty(diff) {
		if (diff === "easy") {
			setMinePercent(0.25);
			setMines(Math.floor(rows * cols * 0.25));
			setImMines(Math.floor(rows * cols * 0.25));
		} else if (diff === "medium") {
			setMinePercent(0.4);
			setMines(Math.floor(rows * cols * 0.4));
			setImMines(Math.floor(rows * cols * 0.4));
		} else if (diff === "hard") {
			setMinePercent(0.5);
			setMines(Math.floor(rows * cols * 0.5));
			setImMines(Math.floor(rows * cols * 0.5));
		}
		setSizeMenu(!sizeMenu);
	}

	async function clearAdjacent(row, col) {
		let ticked = 0;
		for (let i = -1; i < 2; i += 2) {
			if (col + i >= 0 && col + i < cols) {
				if (
					board[row][col + i] === 0 &&
					!getRef(row, col + i).getStatus()
				) {
					await getRef(row, col + i).reveal();
					ticked++;
					ticked += (await clearAdjacent(row, col + i)).valueOf();
				}
			}

			if (row + i >= 0 && row + i < rows) {
				if (
					board[row + i][col] === 0 &&
					!getRef(row + i, col).getStatus()
				) {
					await getRef(row + i, col).reveal();
					ticked++;
					ticked += (await clearAdjacent(row + i, col)).valueOf();
				}
			}
		}
		return ticked;
	}
	async function clearImAdjacent(row, col) {
		let ticked = 0;
		for (let i = -1; i < 2; i += 2) {
			if (col + i >= 0 && col + i < cols) {
				if (
					imaginaryBoard[row][col + i] === 0 &&
					!getImRef(row, col + i).getStatus()
				) {
					await getImRef(row, col + i).reveal();
					ticked++;
					ticked += (await clearImAdjacent(row, col + i)).valueOf();
				}
			}

			if (row + i >= 0 && row + i < rows) {
				if (
					imaginaryBoard[row + i][col] === 0 &&
					!getImRef(row + i, col).getStatus()
				) {
					await getImRef(row + i, col).reveal();
					ticked++;
					ticked += (await clearImAdjacent(row + i, col)).valueOf();
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
	function clickImAround(row, col) {
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (inBounds(row + i, col + j)) {
					if (!getImRef(row + i, col + j).getStatus()) {
						getImRef(row + i, col + j).click();
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
							{winner ? "You win!" : "You lose"}
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
							<div className="flag-count">
								{imMines - imFlagCount}
							</div>
						</div>
					) : (
						<div style={{ display: "flex", alignItems: "center" }}>
							<img className="flag-logo" src={flag} alt="flags" />
							<div className="flag-count">
								{mines - flagCount}
							</div>
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
												clickImSquare(pos, firstClick)
											}
											onRight={(bool) => incImFlag(bool)}
											clickMine={() => clickMine()}
											isGameOver={() => getGameOver()}
											isWinner={() => getWinner()}
											clickAround={(row, col) => {
												clickImAround(row, col);
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
												clickSquare(pos, firstClick)
											}
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
