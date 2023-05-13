import React from "react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import "./Timer.css";

const Timer = forwardRef(function Timer(props, ref) {
	const [time, setTime] = useState(0);
	const [timerOn, setTimerOn] = useState(false);

	useEffect(() => {
		async function wait() {
			await timeout(1000);
			setTime(time + 1);
		}
		if (timerOn) {
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
	return <div className="time">{time}</div>;
});

export default Timer;
