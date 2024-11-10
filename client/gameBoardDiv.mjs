import { gridSize } from "./game-logic/battleships-config.mjs";

export default function getGameboardDiv(divId) {
  const gameboardDiv = document.createElement("div");
  const playCells = [];
  gameboardDiv.id = divId;
  //Top Row
  for (let i = 0; i < gridSize + 1; i++) {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("board-cell");
    cellDiv.classList.add("guide");
    if (i > 0) {
      cellDiv.textContent = String.fromCharCode(i + 64);
    }
    gameboardDiv.appendChild(cellDiv);
  }
  //Remaining Rows
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize + 1; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("board-cell");
      if (j === 0) {
        cellDiv.classList.add("guide");
        cellDiv.textContent = i + 1;
      } else {
        cellDiv.classList.add("empty");
        cellDiv.classList.add("play-cell");
        cellDiv.classList.add("empty");
        playCells.push(cellDiv);
      }
      gameboardDiv.appendChild(cellDiv);
    }
  }
  gameboardDiv.classList.add("gameboard");
  gameboardDiv.style.setProperty("--grid-cols", gridSize + 1);
  return { gameboardDiv, playCells };
}
