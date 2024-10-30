import { availableShips } from "./battleships-config";
import { Ship } from "./ship";

export class Gameboard {
  #grid;
  #placedShips;
  constructor() {
    this.#grid = this.#initialiseGrid();
    this.#placedShips = [];
  }
  get grid() {
    return this.#grid;
  }
  placeShip(shipName, startPoint, endPoint) {
    const newShip = new Ship(shipName);
    if (this.#hasBeenPlaced(newShip.name)) return false;
    if (!this.#isValidLocation(newShip, startPoint, endPoint)) return false;

    this.#addToGrid(newShip, startPoint, endPoint);

    this.#placedShips.push(newShip);
    return true;
  }

  #hasBeenPlaced(shipName) {
    return this.#placedShips.some((ship) => ship.name === shipName);
  }

  #isValidLocation(shipName, startPoint, endPoint) {
    return (
      this.#isInBounds(startPoint, endPoint) &&
      this.#isValidOrientation(shipName, startPoint, endPoint)
    );
  }

  #isInBounds(startPoint, endPoint) {
    let isInBoundsCheck = true;
    for (const value of [
      startPoint.row,
      startPoint.col,
      endPoint.row,
      endPoint.col,
    ]) {
      if (value < 0 || value > 9) {
        isInBoundsCheck = false;
      }
    }
    return isInBoundsCheck;
  }

  #isValidOrientation(shipName, startPoint, endPoint) {
    const shipLength = shipName.length;
    const rowDifference = Math.abs(startPoint.row - endPoint.row);
    const colDifference = Math.abs(startPoint.col - endPoint.col);
    if (rowDifference === 0 || colDifference === 0) {
      return Math.max(rowDifference, colDifference) === shipLength - 1;
    } else {
      return (
        rowDifference === colDifference && rowDifference === shipLength - 1
      );
    }
  }

  #initialiseGrid() {
    return Array.from({ length: 10 }, (v, i) =>
      Array.from({ length: 10 }, (v, i) => "#")
    );
  }

  #addToGrid(newShip, startPoint, endPoint) {
    const shipLength = newShip.length;
    const rowInc =
      startPoint.row === endPoint.row
        ? 0
        : startPoint.row < endPoint.row
        ? 1
        : -1;
    const colInc = (endPoint.col - startPoint.col) / (shipLength - 1);

    for (let i = 0; i < shipLength; i++) {
      this.#grid[startPoint.row + rowInc * i][startPoint.col + colInc * i] =
        newShip.name[0].toUpperCase();
    }
  }
}
