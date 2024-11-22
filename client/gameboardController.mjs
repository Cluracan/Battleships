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
          cellDiv.addEventListener(
            "mouseover",
            this.handleMouseOver.bind(this)
          );
          cellDiv.addEventListener("mouseout", this.handleMouseOut.bind(this));
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
    if (this.selectedShip) {
      const curRow = parseInt(e.target.dataset.rowIndex);
      const curCol = parseInt(e.target.dataset.colIndex);
      const { shipLength, shipPartIndex, orientation } = this.selectedShip;
      const { startPoint, endPoint, allPoints } = this.getCoordinates(
        curRow,
        curCol,
        shipLength,
        shipPartIndex,
        orientation
      );

      if (this.isValidLocation(shipLength, startPoint, endPoint)) {
        this.highlightCells(allPoints, "valid");
      } else {
        this.highlightCells(allPoints, "invalid");
      }
    }
  }

  handleMouseOut(e) {
    this.removeHighlights();
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
    const allPoints = [];
    for (let i = 0; i < shipLength; i++) {
      const curPoint = {
        row: startPoint.row + i * rowInc,
        col: startPoint.col + i * colInc,
      };
      allPoints.push(curPoint);
    }
    const endPoint = allPoints[shipLength - 1];
    return { startPoint, endPoint, allPoints };
  }

  highlightCells(allPoints, validCheck) {
    this.removeHighlights();
    for (const { row, col } of allPoints) {
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        this.playCells[row * gridSize + col].classList.add(
          `highlight-${validCheck}`
        );
      }
    }
  }

  removeHighlights() {
    this.playCells.forEach((cell) => {
      cell.classList.remove("highlight-valid");
      cell.classList.remove("highlight-invalid");
    });
  }
  placeSelectedShip() {}
}
