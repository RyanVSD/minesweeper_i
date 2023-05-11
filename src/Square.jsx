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
    []
  );
  if (revealed) {
    return (
      <button
        className="square-show"
        onClick={() => {
          setRevealed(!revealed);
          props.onClick(props.row + " " + props.col);
        }}
      >
        {value}
      </button>
    );
  } else {
    return (
      <button
        className="square-hide"
        onClick={() => {
          setRevealed(!revealed);
          props.onClick(props.row + " " + props.col);
        }}
      ></button>
    );
  }
});

export default Square;
