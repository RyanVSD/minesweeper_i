import React from 'react'; 
import { useState } from 'react';

export default function Square(props) {
    const [value, setValue] = useState(props.value);
    return (
        <div className="Square">
            {value}
        </div>
    )
}