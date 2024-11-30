import { Ship } from "./ship.mjs";
import { availableShips, gridSize } from "./battleships-config.mjs";

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

  get placedShips() {
    return this.#placedShips;
  }

  placeShip(shipId, startPoint, endPoint, allPoints, shipOrientation) {
    const newShip = new Ship(shipId);
    newShip.allPoints = allPoints;
    newShip.orientation = shipOrientation;
    this.#addToGrid(newShip, startPoint, endPoint);
    this.#placedShips.push(newShip);
  }

  resetBoard() {
    this.#grid = this.#initialiseGrid();
    this.#placedShips = [];
  }

  receiveAttack(attackPoint) {
    const targetCell = this.#grid[attackPoint.row][attackPoint.col];
    if (!targetCell.ship) {
      this.#grid[attackPoint.row][attackPoint.col].shotFired = true;
      return "MISS";
    } else {
      let targetShip = this.ships.find((ship) => ship.name === targetCell.ship);
      targetShip.scoreHit();
      this.#grid[attackPoint.row][attackPoint.col].shotFired = true;
      return "HIT";
    }
  }

  #isValidShipId(shipId) {
    return availableShips.some((ship) => ship.id === shipId);
  }

  #hasBeenPlaced(shipId) {
    return this.#placedShips.some((ship) => ship.id === shipId);
  }

  isValidLocation(shipLength, startPoint, endPoint) {
    return (
      this.#isInBounds(startPoint, endPoint) &&
      this.#isValidOrientation(shipLength, startPoint, endPoint) &&
      this.#isFreeOfShips(shipLength, startPoint, endPoint)
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
      if (value < 0 || value > gridSize - 1) {
        isInBoundsCheck = false;
      }
    }
    return isInBoundsCheck;
  }

  #isValidOrientation(shipLength, startPoint, endPoint) {
    const rowDifference = Math.abs(startPoint.row - endPoint.row);
    const colDifference = Math.abs(startPoint.col - endPoint.col);

    if (rowDifference === 0 || colDifference === 0) {
      return Math.max(rowDifference, colDifference) === shipLength - 1;
    } else {
      return false;
      //  vvvvvvvvvvvvvthis allows diagonalsvvvvvvvvvvvvvvvv
      //  (
      //   rowDifference === colDifference && rowDifference === shipLength - 1
      // );
    }
  }

  #isFreeOfShips(shipLength, startPoint, endPoint) {
    let shipCells = this.#getShipLocationCells(
      shipLength,
      startPoint,
      endPoint
    );
    return shipCells.every(
      (cellLocation) =>
        this.grid[cellLocation.row][cellLocation.col].ship === undefined
    );
  }

  #initialiseGrid() {
    return Array.from({ length: gridSize }, (v, i) =>
      Array.from({ length: gridSize }, (v, i) => {
        return {
          ship: undefined,
          shotFired: false,
        };
      })
    );
  }

  #getShipLocationCells(shipLength, startPoint, endPoint) {
    const cellArray = [];
    const numberOfSteps = shipLength - 1;
    const rowInc = (endPoint.row - startPoint.row) / numberOfSteps;
    const colInc = (endPoint.col - startPoint.col) / numberOfSteps;

    for (let i = 0; i < shipLength; i++) {
      cellArray.push({
        row: startPoint.row + rowInc * i,
        col: startPoint.col + colInc * i,
      });
    }
    return cellArray;
  }

  #addToGrid(newShip, startPoint, endPoint) {
    let shipCells = this.#getShipLocationCells(
      newShip.length,
      startPoint,
      endPoint
    );

    shipCells.forEach((location) => {
      this.#grid[location.row][location.col].ship = newShip.name;
    });
  }
}
