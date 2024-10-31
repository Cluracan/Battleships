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

  get ships() {
    return this.#placedShips;
  }

  placeShip(shipName, startPoint, endPoint) {
    const newShip = new Ship(shipName);
    if (this.#hasBeenPlaced(newShip.name)) return false;
    if (!this.#isValidLocation(newShip, startPoint, endPoint)) return false;
    this.#addToGrid(newShip, startPoint, endPoint);
    this.#placedShips.push(newShip);
    return true;
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

  #hasBeenPlaced(shipName) {
    return this.#placedShips.some((ship) => ship.name === shipName);
  }

  #isValidLocation(shipName, startPoint, endPoint) {
    return (
      this.#isInBounds(startPoint, endPoint) &&
      this.#isValidOrientation(shipName, startPoint, endPoint) &&
      this.#isFreeOfShips(shipName, startPoint, endPoint)
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

  #isFreeOfShips(shipName, startPoint, endPoint) {
    let shipCells = this.#getShipLocationCells(shipName, startPoint, endPoint);
    return shipCells.every(
      (cellLocation) =>
        this.grid[cellLocation.row][cellLocation.col].ship === undefined
    );
  }

  #initialiseGrid() {
    return Array.from({ length: 10 }, (v, i) =>
      Array.from({ length: 10 }, (v, i) => {
        return {
          ship: undefined,
          shotFired: false,
        };
      })
    );
  }

  #getShipLocationCells(newShip, startPoint, endPoint) {
    const cellArray = [];
    const numberOfSteps = newShip.length - 1;
    const rowInc = (endPoint.row - startPoint.row) / numberOfSteps;
    const colInc = (endPoint.col - startPoint.col) / numberOfSteps;

    for (let i = 0; i < newShip.length; i++) {
      cellArray.push({
        row: startPoint.row + rowInc * i,
        col: startPoint.col + colInc * i,
      });
    }
    return cellArray;
  }

  #addToGrid(newShip, startPoint, endPoint) {
    let shipCells = this.#getShipLocationCells(newShip, startPoint, endPoint);

    shipCells.forEach((location) => {
      this.#grid[location.row][location.col].ship = newShip.name;
    });
  }
}
