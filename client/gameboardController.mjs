import { gridSize } from "./game-logic/battleships-config.mjs";
import { Gameboard } from "./game-logic/gameboard.mjs";
import { cleanContent } from "./utils.mjs";

/* selectedShip object: ---make private and have setter/getter?
gameboardController.selectedShip = {
  id: selectedShipDiv.id,
  shipLength: selectedShipDiv.dataset.shipLength,
  shipPartIndex: selectedShipDiv.dataset.selectedPartIndex,
  orientation: 0,
};
*/

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
          cellDiv.addEventListener(
            "mouseover",
            this.handleMouseOver.bind(this)
          );
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

  handleMouseOver(e) {
    console.log(this);
    console.log(e);
    if (this.selectedShip) {
      const curRow = parseInt(e.target.dataset.rowIndex);
      const curCol = parseInt(e.target.dataset.colIndex);
      const [startPoint, endPoint] = this.getCoordinates(
        curRow,
        curCol,
        this.selectedShip.shipLength,
        this.selectedShip.shipPartIndex,
        this.selectedShip.orientation
      );
      console.log(startPoint, endPoint);

      console.log(
        this.isValidLocation(this.selectedShip.shipLength, startPoint, endPoint)
      );
    }
  }

  getCoordinates(curRow, curCol, shipLength, shipPartIndex, orientation) {
    const orientationMap = {
      0: { rowInc: 0, colInc: 1 },
      1: { rowInc: 1, colInc: 0 },
      2: { rowInc: 0, colInc: -1 },
      3: { rowInc: -1, colInc: 0 },
    };
    let { rowInc, colInc } = orientationMap[orientation];

    const startPoint = {
      row: curRow - shipPartIndex * rowInc,
      col: curCol - shipPartIndex * colInc,
    };
    const endPoint = {
      row: curRow + (shipLength - 1 - shipPartIndex) * rowInc,
      col: curCol + (shipLength - 1 - shipPartIndex) * colInc,
    };
    return [startPoint, endPoint];
  }
}
