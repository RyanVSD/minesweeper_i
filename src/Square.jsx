import React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import "./Square.css";

const Square = forwardRef(function Square(props, ref) {
  const [value, setValue] = useState(props.value);
  const [revealed, setRevealed] = useState(props.revealed);

  function getChecker() {
    if(props.row % 2 === 0) {
      if(props.col % 2 === 0) {
        return "checker-light"
      } else {
        return "checker-dark"
      }
    } else {
      if(!props.col % 2 !== 0) {
        return "checker-light"
      } else {
        return "checker-dark"
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
        reveal() {
          setRevealed(true);
        },
        getStatus() { 
          return revealed;
        }
      };
    },
    [props.col, props.row, revealed]
  );
  if (revealed) {
    return (
      <button className={"square-show-" + getChecker() + " " + (value === -1 ? "mine " : value + " square-show ")}>
        {value}
      </button>
    );
  } else {
    return (
      <button
        className={"square-hide-" + getChecker() + " square-hide "}
        onClick={() => {
          setRevealed(!revealed);
          props.onClick(props.row + " " + props.col);
        }}
      >
      </button>
    );
  }
});

export default Square;
