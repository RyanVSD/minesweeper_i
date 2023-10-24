import React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import "./Square.css";
import flag from "./images/flag.jpg";
import imflag from "./images/imaginaryFlag.png";

const Square = forwardRef(function Square(props, ref) {
	const [value, setValue] = useState(props.value);
	const [revealed, setRevealed] = useState(props.revealed);
	const [isFlagged, setIsFlagged] = useState(false);

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
	if (revealed) {
		return (
			<button
				className={
					"square-show-" +
					getChecker() +
					(props.imaginary ? "-neg" : "") +
					" " +
					(value === -1 ? "mine " : value + " square-show ") +
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
				{value === -1 || value === 0 ? "" : value}
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
					(value === -1 && props.isWinner() ? "mine " : "") +
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
});

export default Square;
