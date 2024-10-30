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
    if (!this.#isValidShip(shipName, startPoint, endPoint)) return false;
    if (!this.#isValidLocation(startPoint, endPoint)) return false;

    const newShip = new Ship(shipName);

    this.#addToGrid(newShip, startPoint, endPoint);

    this.#placedShips.push(newShip);
    return true;
  }

  #isValidLocation(startPoint, endPoint) {
    let isInBoundsCheck = true;
    for (const curPoint of [startPoint, endPoint]) {
      if (
        curPoint.row < 0 ||
        curPoint.row > 9 ||
        curPoint.col < 0 ||
        curPoint.col > 9
      ) {
        isInBoundsCheck = false;
      }
    }
    return isInBoundsCheck;
  }
  #isValidShip(shipName, startPoint, endPoint) {
    return (
      this.#shipNameExists(shipName) &&
      this.#shipLocationValid(shipName, startPoint, endPoint)
    );
  }

  #shipNameExists(shipName) {
    return !this.#placedShips.some((ship) => ship.name === shipName);
  }

  #shipLocationValid(shipName, startPoint, endPoint) {
    const shipLength = availableShips[shipName].length;
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
