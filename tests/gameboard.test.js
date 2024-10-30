import { test, expect, describe, beforeEach } from "vitest";
import { Gameboard } from "../gameboard";

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
    expect(testBoard.grid[2][3]).toBe("#");
    expect(testBoard.grid[5][8]).toBe("#");
  });
  test("can place ship", () => {
    testBoard.placeShip("submarine", { row: 0, col: 2 }, { row: 2, col: 4 });
    for (const point of [
      { row: 0, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 4 },
    ]) {
      expect(testBoard.grid[point.row][point.col]).toBe("S");
    }
    testBoard.placeShip("battleship", { row: 0, col: 3 }, { row: 0, col: 6 });
    for (const point of [
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 0, col: 6 },
    ]) {
      expect(testBoard.grid[point.row][point.col]).toBe("B");
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
  test("correct ship placement returns true", () => {
    expect(
      testBoard.placeShip("patrol boat", { row: 0, col: 2 }, { row: 0, col: 1 })
    ).toBe(true);
  });
});
