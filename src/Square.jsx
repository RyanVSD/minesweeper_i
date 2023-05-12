import React from "react";
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import "./Square.css";

const Square = forwardRef(function Square(props, ref) {
  const [value, setValue] = useState(props.value);
  const [revealed, setRevealed] = useState(props.revealed);
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
      };
    },
    [props.col, props.row]
  );
  if (revealed) {
    return (
      <button className={"square-show " + (value === -1 ? "mine" : "")}>
        {value}
      </button>
    );
  } else {
    return (
      <button
        className={"square-hide " + (value === -1 ? "mine" : "")}
        onClick={() => {
          setRevealed(!revealed);
          props.onClick(props.row + " " + props.col);
        }}
      >
        {value}
      </button>
    );
  }
});

export default Square;
