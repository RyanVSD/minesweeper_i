import React from "react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import "./Timer.css";

const Timer = forwardRef(function Timer(props, ref) {
	const [time, setTime] = useState(0);
	const [timerOn, setTimerOn] = useState(false);

	useEffect(() => {
		async function wait() {
			await timeout(10);
			setTime(time + 0.01);
		}
		if (timerOn && time < 999) {
			wait();
		}
	}, [timerOn, time]);

	useImperativeHandle(
		ref,
		() => {
			return {
				startTime() {
					setTimerOn(true);
				},
				endTime() {
					setTimerOn(false);
				},
				resetTime() {
					setTime(0);
				},
			};
		},
		[]
	);

	async function timeout(delay) {
		return new Promise((res) => setTimeout(res, delay));
	}
	return <div className="time">{Math.floor(time)}</div>;
});

export default Timer;
