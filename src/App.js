import './App.css';
import Board from './Board';
import {useState} from 'react';

function App() {
  const [rows, setRows] = useState(14);
  const [cols, setCols] = useState(18);
  const [mines, setMines] = useState(0.175);

  return (
    <div className="App">
      <div style={{fontWeight: 'bold', margin: '10px'}}>Minesweeper</div>
      <div>Board Sizes</div>
      <button onClick={() => {setRows(8); setCols(10)}}>Small</button>
      <button onClick={() => {setRows(14); setCols(18)}}>Med</button>
      <button onClick={() => {setRows(20); setCols(24)}}>Large</button>
      <br/> <br/>
      <div>Mine Amount</div>
      <button onClick={() => {setMines(0.1)}}>Easy</button>
      <button onClick={() => {setMines(0.175)}}>Medium</button>
      <button onClick={() => {setMines(0.25)}}>Hard</button>
      <Board rows={rows} cols={cols} mines={Math.floor(rows*cols*mines)}/>
    </div>
  );
}

export default App;
