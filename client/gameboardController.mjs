import { gridSize } from "./game-logic/battleships-config.mjs";
import { Gameboard } from "./game-logic/gameboard.mjs";
import { cleanContent } from "./utils.mjs";

export default class GameboardController extends Gameboard {
  gameboardDiv;
  playCells;
  selectedShip;
  constructor(contentHolder) {
    super();
    this.contentHolder = contentHolder;
    this.intialiseGameBoardDisplay();
    this.selectedShip = null;
  }

  intialiseGameBoardDisplay() {
    this.gameboardDiv = document.createElement("div");
    this.playCells = [];
    this.gameboardDiv.id = "gameboard";
    //Top Row
    for (let i = 0; i < gridSize + 1; i++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("board-cell");
      cellDiv.classList.add("guide");
      if (i > 0) {
        cellDiv.textContent = String.fromCharCode(i + 64);
      }
      this.gameboardDiv.appendChild(cellDiv);
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
          cellDiv.dataset.rowIndex = i;
          cellDiv.dataset.colIndex = j - 1;
          cellDiv.dataset.shipPlaced = false;
          this.playCells.push(cellDiv);
        }
        this.gameboardDiv.appendChild(cellDiv);
      }
    }
    this.gameboardDiv.classList.add("gameboard");
    this.gameboardDiv.style.setProperty("--grid-cols", gridSize + 1);
    cleanContent(this.contentHolder);
    this.contentHolder.appendChild(this.gameboardDiv);
  }
}
