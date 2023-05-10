import React, { useEffect, useState } from 'react'; 
import * as c from './Constants';
import Square from './Square';
import "./Board.css"

export default function Board(props) {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        let ar = [];
        for(var i = 0; i < props.cols; i++) {
            let row = [];
            /*for(var j = 0; i < props.cols; j++) {
               row.push(c.CONSTANTS.Empty);
            }*/
            ar.push(row);
        }
        for(i = 0; i < props.cols; i++) {
            for(var j = 0; j < props.rows; j++) {
                ar[i].push(c.CONSTANTS.Empty);
            }
        }
        setBoard(ar);
        console.log(ar);
    }, [props.cols, props.rows])


    function getCols() {
        return '1fr '.repeat(props.cols);
    }

    function getRows() {
        return '1fr '.repeat(props.rows);
    }

    console.log(getCols());

    return (<div className="board">
        I am board with {props.cols} columns and
        {" "}{props.rows} rows with {props.mines} mines 
         {" "}resulting in a mine percent of 
         {" "}{props.mines / (props.rows * props.cols)}
         <div style={{display: 'grid', gridTemplateColumns: getCols()}}>
         {board.map((row) => {
            console.log(row);
            return (
             <div style={{display: 'grid', gridTemplateRows: getRows()}}> 
                {row.map((item) => {
                    return <Square revealed={true} value={item}/>
                })}
             </div>   
            )
            
        })}
         </div>
        </div>
    )
}