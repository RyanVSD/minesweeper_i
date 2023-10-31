import React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import "./Square.css";
import flag from "./images/flag.jpg";
import imflag from "./images/imaginaryFlag.png";
import bomb from "./images/labombareal.png";
import imbomb from "./images/labombaimaginary.png";
import { useEffect } from "react";

const Square = forwardRef(function Square(props, ref) {
	const [value, setValue] = useState(props.value);
	const [revealed, setRevealed] = useState(props.revealed);
	const [isFlagged, setIsFlagged] = useState(false);
	const [imValue, setImValue] = useState("");
	const [nValue, setNValue] = useState("");

	useEffect(() => {
		let arr = String(value).split(" + ");
		if (arr.length > 1) {
			setImValue(
				String(arr[1]).split("i")[0] > 0
					? String(arr[1]).split("i")[0]
					: ""
			);
			setNValue(arr[0] > 0 ? arr[0] : "");
		} else {
			if (String(arr[0]).includes("i")) {
				setImValue(String(arr[0]).split("i")[0]);
			} else {
				setNValue(arr[0]);
			}
		}
	}, [value]);

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
						if (value === -1) {
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
		[revealed, isFlagged, props, value]
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
						if (value !== 0) {
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
					{value === -1 || value === 0 ? (
						""
					) : (
						<div>
							<span className={nValue}>
								{nValue > 0 ? nValue : ""}
							</span>
							<span>
								{imValue > 0 && nValue > 0 ? " + " : ""}
							</span>
							<span className={imValue}>
								{imValue > 0 ? imValue + "i" : ""}
							</span>
						</div>
					)}
					{value === -1 ? (
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
						<></>
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
							if (value === -1) {
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
