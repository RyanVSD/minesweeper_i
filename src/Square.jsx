import React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import "./Square.css";
import flag from "./images/flag.jpg";
import imflag from "./images/imaginaryFlag.png";
import bomb from "./images/labombareal.png";
import imbomb from "./images/labombaimaginary.png";
import { useEffect } from "react";

const Square = forwardRef(function Square(props, ref) {
	const [value, setValue] = useState("");
	const [revealed, setRevealed] = useState(props.revealed);
	const [isFlagged, setIsFlagged] = useState(false);
	const [autoClicked, setAutoClicked] = useState(false);

	useEffect(() => {
		console.log(props.value, nValue(value), imValue(value));
		if (props.imaginary) {
			if (!autoClicked && revealed && imValue(value) === "") {
				console.log("clicking im");
				props.clickAround(props.row, props.col);
				setAutoClicked(true);
			}
		} else {
			if (!autoClicked && revealed && nValue(value) === "") {
				console.log("clicking norm");
				props.clickAround(props.row, props.col);
				setAutoClicked(true);
			}
		}
	}, [autoClicked, props, revealed, value]);

	function imValue(val) {
		if (!val) return "";
		let arr = String(val).split(" + ");
		if (arr.length > 1) {
			console.log(
				String(arr[1]).split("i")[0] > 0
					? String(arr[1]).split("i")[0]
					: ""
			);
			return String(arr[1]).split("i")[0] > 0
				? String(arr[1]).split("i")[0]
				: "";
		} else {
			if (String(arr[0]).includes("i")) {
				return String(arr[0]).split("i")[0];
			}
		}
		return "";
	}
	//gets the real number part of the value assigned to the square
	function nValue(val) {
		if (!val) return "";
		let arr = String(val).split(" + ");
		if (arr.length > 1) {
			return arr[0] > 0 ? arr[0] : "";
		} else {
			if (!String(arr[0]).includes("i")) {
				return arr[0];
			}
		}
		return "";
	}

	function getChecker() {
		if (props.row % 2 === 0) {
			if (props.col % 2 === 0) {
				return "checker-light";
			} else {
				return "checker-dark";
			}
		} else {
			if (props.col % 2 !== 0) {
				return "checker-light";
			} else {
				return "checker-dark";
			}
		}
	}
	useImperativeHandle(
		ref,
		() => {
			return {
				getPos() {
					return props.row + "" + props.col;
				},
				updateValue(value) {
					setValue(value);
				},
				async reveal() {
					setRevealed(true);
					if (isFlagged) {
						setIsFlagged(false);
					}
				},
				getStatus() {
					return revealed;
				},
				getFlagStatus() {
					return isFlagged;
				},
				click() {
					if (!isFlagged && !props.isGameOver()) {
						if (props.value === -1) {
							setRevealed(!revealed);
							props.clickMine();
						} else {
							setRevealed(!revealed);
							props.onClick(props.row + " " + props.col);
						}
					}
				},
			};
		},
		[revealed, isFlagged, props]
	);
	if (props.imView() === props.imaginary) {
		if (revealed) {
			return (
				<button
					className={
						"square-show-" +
						getChecker() +
						(props.imaginary ? "-neg" : "") +
						" " +
						" square-show " +
						(props.hidden ? "hide " : "show ")
					}
					onClick={() => {
						console.log(value);

						if (props.value !== 0) {
							props.clickAround(props.row, props.col);
						}
					}}
				>
					{isFlagged ? (
						<img
							className="square-flag"
							src={props.imaginary ? imflag : flag}
							alt="F"
						/>
					) : (
						<></>
					)}
					{props.value === -1 ? (
						<img
							src={props.imaginary ? imbomb : bomb}
							alt="bomb"
							style={{
								height: "30px",
								margin: "0",
								width: "30px",
							}}
						/>
					) : (
						<div>
							<span className={nValue(value)}>
								{nValue(value) ? nValue(value) : ""}
							</span>
							<span>
								{imValue(value) && nValue(value) ? " + " : ""}
							</span>
							<span className={imValue(value)}>
								{imValue(value) ? imValue(value) + "i" : ""}
							</span>
						</div>
					)}
				</button>
			);
		} else {
			return (
				<button
					className={
						"square-hide-" +
						getChecker() +
						(props.imaginary ? "-neg" : "") +
						" square-hide " +
						(props.hidden ? "hide " : "show ")
					}
					onClick={() => {
						if (!isFlagged && !props.isGameOver()) {
							if (props.value === -1) {
								setRevealed(!revealed);
								props.clickMine();
							} else {
								setRevealed(!revealed);
								props.onClick(props.row + " " + props.col);
							}
						}
					}}
					onContextMenu={() => {
						setIsFlagged(!isFlagged);
						props.onRight(!isFlagged);
					}}
				>
					{isFlagged ? (
						<img
							className="square-flag"
							src={props.imaginary ? imflag : flag}
							alt="F"
						/>
					) : (
						<></>
					)}
				</button>
			);
		}
	}
});

export default Square;
