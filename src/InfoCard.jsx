import React from "react";
import "./InfoCard.css";

export default function InfoCard(props) {
	return (
		<div className="card">
			<div className="title">{props.title}</div>
			<div className="subtitle">{props.subtitle}</div>
			<div className="card-text">{props.text}</div>
		</div>
	);
}
