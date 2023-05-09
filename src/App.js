import './App.css';
import Board from './Board';
import {useState} from 'react';

function App() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(20);

  return (
    <div className="App">
      <div>Minesweeper</div>
      <Board rows={10} cols={10} mines={20}/>
    </div>
  );
}

export default App;
