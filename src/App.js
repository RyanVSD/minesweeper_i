import "./App.css";
import Board from "./Board";
import Card from "./InfoCard";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
function App() {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  return (
    <div className="App">
      <Dialog
        fullscreen
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
      >
        <div className="card-holder">
          <Card
            title="Release"
            subtitle="Version 1.0"
            text="Just minesweeper have fun :)"
          />
        </div>
        <div className="card-holder">
          <Card
            title="Go faster update"
            subtitle="Version 1.1"
            text="New feature: if you click on a revealed square (that isn't empty and has a number in it) it will automatically click all squares around it. This will allow you to go much faster, just make sure to flag the mines around the squares first!"
          />
        </div>
        <div className="card-holder">
          <Card
            title="Menu Update"
            subtitle="Version 1.2"
            text="All buttons have been moved into the board to make for a cleaner interface!"
          />
        </div>
        <div className="card-holder">
          <Card
            title="Fullscreen Update"
            subtitle="Version 1.2.1"
            text="Fullscreen option added"
          />
        </div>
      </Dialog>
      <Dialog
        fullscreen
        maxWidth={"none"}
        maxHeight={"none"}
        open={fullScreen}
        onClose={() => {
          setFullScreen(!fullScreen);
        }}
      >
        <Board
          openChangelogs={() => setOpen(!open)}
          fullscreen={() => setFullScreen(!fullScreen)}
        />
      </Dialog>
      <Board
        openChangelogs={() => setOpen(!open)}
        fullscreen={() => setFullScreen(!fullScreen)}
      />
    </div>
  );
}

export default App;
