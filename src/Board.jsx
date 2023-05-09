import React, { useEffect, useState } from 'react'; 
import * as c from './Constants';
import Square from './Square';

export default function Board(props) {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        let ar = [];
        for(var i = 0; i < props.rows; i++) {
            let row = [];
            /*for(var j = 0; i < props.cols; j++) {
               row.push(c.CONSTANTS.Empty);
            }*/
            ar.push(row);
        }
        for(var i = 0; i < props.rows; i++) {
            for(var j = 0; j < props.cols; j++) {
                ar[i].push(c.CONSTANTS.Empty);
            }
        }
        setBoard(ar);
        console.log(ar);
    }, [props.cols, props.rows])
    return (<div className="board">
        I am board with {props.cols} columns and
        {" "}{props.rows} rows with {props.mines} mines 
         {" "}resulting in a mine percent of 
         {" "}{props.mines / (props.rows * props.cols)}
         <div>
         {board.map((row) => {
            console.log(row);
            return (
             <div> 
                {row.map((item) => {
                    return <Square value={item}/>
                })}
             </div>   
            )
            
        })}
         </div>
        <Square value="0"/>
        </div>
    )
}