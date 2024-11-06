import { test, expect, describe, beforeEach } from "vitest";
import { Gameboard } from "../game-logic/gameboard";

test("Gameboard class exists", () => {
  expect(typeof Gameboard).toBe("function");
});

describe("Ship placement", () => {
  let testBoard;
  beforeEach(() => (testBoard = new Gameboard()));

  test("has a placeShip function", () => {
    expect(typeof testBoard.placeShip).toBe("function");
  });

  test("gameboard grid can be accessed", () => {
    expect(testBoard.grid[2][3].ship).toBe(undefined);
    expect(testBoard.grid[5][8].ship).toBe(undefined);
  });

  test("can place ship", () => {
    //diagonal test
    // testBoard.placeShip("submarine", { row: 0, col: 2 }, { row: 2, col: 4 });
    // for (const point of [
    //   { row: 0, col: 2 },
    //   { row: 1, col: 3 },
    //   { row: 2, col: 4 },
    // ]) {
    //   expect(testBoard.grid[point.row][point.col].ship).toBe("submarine");
    // }
    testBoard.placeShip("battleship", { row: 0, col: 3 }, { row: 0, col: 6 });
    for (const point of [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 0, col: 6 },
    ]) {
      expect(testBoard.grid[point.row][point.col].ship).toBe("battleship");
      expect(1 + 1).toBe;
    }
  });

  test("cannot place a ship out of bounds", () => {
    expect(
      testBoard.placeShip("submarine", { row: 0, col: 2 }, { row: 2, col: -1 })
    ).toBe(false);
  });

  test("cannot add an already-placed ship", () => {
    testBoard.placeShip("submarine", { row: 4, col: 1 }, { row: 4, col: 3 });
    expect(
      testBoard.placeShip("submarine", { row: 0, col: 2 }, { row: 2, col: 3 })
    ).toBe(false);
  });

  test("cannot add a misplaced ship", () => {
    expect(
      testBoard.placeShip("submarine", { row: 6, col: 2 }, { row: 6, col: 1 })
    ).toBe(false);
  });

  test("cannot lay a ship over the top of existing ship", () => {
    testBoard.placeShip("battleship", { row: 3, col: 1 }, { row: 3, col: 4 });
    testBoard.placeShip("destroyer", { row: 5, col: 8 }, { row: 7, col: 8 });

    expect(
      testBoard.placeShip("submarine", { row: 3, col: 1 }, { row: 3, col: 3 })
    ).toBe(false);
  });

  test("correct ship placement returns true", () => {
    expect(
      testBoard.placeShip("patrol boat", { row: 0, col: 2 }, { row: 0, col: 1 })
    ).toBe(true);
  });

  test("correct ship placement adds ship to placedShips store", () => {
    testBoard.placeShip("patrol boat", { row: 0, col: 2 }, { row: 0, col: 1 });
    testBoard.placeShip("submarine", { row: 1, col: 2 }, { row: 1, col: 4 });
    expect(testBoard.ships.length).toBe(2);
  });

  test("gameboard can be reset", () => {
    testBoard.placeShip("carrier", { row: 9, col: 9 }, { row: 5, col: 9 });
    testBoard.placeShip("battleship", { row: 0, col: 3 }, { row: 0, col: 6 });
    testBoard.resetBoard();
    expect(testBoard.ships.length).toBe(0);
    expect(
      testBoard.grid.some((row) =>
        row.some((cell) => cell.ship != undefined || cell.shotFired === true)
      )
    ).toBe(false);
  });
});

describe("Receive attack", () => {
  let testBoard;
  beforeEach(() => (testBoard = new Gameboard()));

  test("has a receiveAttack function", () => {
    expect(typeof testBoard.receiveAttack).toBe("function");
  });

  test("attack is placed on grid", () => {
    testBoard.receiveAttack({ row: 2, col: 2 });
    expect(testBoard.grid[2][2].shotFired).toBe(true);
    testBoard.receiveAttack({ row: 4, col: 1 });
    expect(testBoard.grid[4][1].shotFired).toBe(true);
  });

  test("notification given if attack hits ship", () => {
    testBoard.placeShip("battleship", { row: 0, col: 3 }, { row: 0, col: 6 });
    expect(testBoard.receiveAttack({ row: 0, col: 4 })).toBe("HIT");
  });

  test("ship hitcount increased if attack hits ship", () => {
    testBoard.placeShip("battleship", { row: 0, col: 3 }, { row: 0, col: 6 });
    testBoard.receiveAttack({ row: 0, col: 4 });
    expect(
      testBoard.ships.find((ship) => ship.name === "battleship").hitCount
    ).toBe(1);
  });

  test("ship can be sunk with hits", () => {
    testBoard.placeShip("carrier", { row: 9, col: 9 }, { row: 5, col: 9 });
    for (let i = 0; i < 5; i++) {
      testBoard.receiveAttack({ row: 9 - i, col: 9 });
    }
    //Print GRID
    testBoard.grid.forEach((row) => {
      let printRow = row
        .map((cell) =>
          cell.ship ? (cell.shotFired ? "#" : cell.ship[0].toUpperCase()) : "."
        )
        .join("");
      console.log(printRow);
    });

    expect(testBoard.ships.find((ship) => ship.name === "carrier").isSunk).toBe(
      true
    );
  });
});
