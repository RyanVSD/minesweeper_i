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
						text="Imaginary minesweeper release. Each square is adjacent to ones it normally would be in its dimension, as well as those around it in the other dimension. This includes the same square in the other dimension as well.
            You have to clear both dimensions to win. The mine count is displayed as a complex number, denoting the normal mines and imaginary mines it borders."
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
