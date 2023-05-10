import React from 'react'; 
import { useState } from 'react';
import './Square.css'

export default function Square(props) {
    const [value, setValue] = useState(props.value);
    const [revealed, setRevealed] = useState(false);
    if(revealed) {
        return (
            <button className="square-show" onClick={() => setRevealed(!revealed)}>
                {value}
            </button>
        )
    } else {
        return <button className="square-hide" onClick={() => setRevealed(!revealed)}>
            
            </button>
    }
}