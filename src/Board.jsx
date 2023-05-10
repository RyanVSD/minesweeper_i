import React, { useEffect, useState } from 'react'; 
import * as c from './Constants';
import Square from './Square';
import "./Board.css"

export default function Board(props) {
    //Holds board data
    const [board, setBoard] = useState([]);
    //Records whether the first mine is clicked
    const [firstClick, setFirstClick] = useState(false);
    //Inits empty board
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

    //Returns col number of 1frs
    function getCols() {
        return '1fr '.repeat(props.cols);
    }
    //Returns row number of 1frs
    function getRows() {
        return '1fr '.repeat(props.rows);
    }
    
    return (<div className="board">
        I am board with {props.cols} columns and
        {" "}{props.rows} rows with {props.mines} mines 
         {" "}resulting in a mine percent of 
         {" "}{Math.round(props.mines / (props.rows * props.cols) * 1000)/10 + "%"}
         <div className="main-board" style={{display: 'grid', gridTemplateColumns: getCols()}}>
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