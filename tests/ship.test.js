import { expect, test, describe } from "vitest";
import { Ship } from "../client/game-logic/ship.mjs";
import { availableShips } from "../client/game-logic/battleships-config.mjs";

test("Ship class exists", () => {
  expect(typeof Ship).toBe("function");
});
test("Can create ship instance", () => {
  const testShip = new Ship("battleship");
  expect(typeof testShip).toBe("object");
});

describe("instance properties: accessors", () => {
  const testShips = availableShips;
  testShips.forEach((ship) => {
    const testShip = new Ship(ship.id);
    test("correct name", () => {
      expect(testShip.name).toBe(ship.name);
    });
    test("correct length", () => {
      expect(testShip.length).toBe(ship.length);
    });
    test("currect hitCount", () => {
      expect(testShip.hitCount).toBe(0);
    });
    test("not sunk", () => {
      expect(testShip.isSunk).toBe(false);
    });
  });
});

describe("instance properties: setters/changes", () => {
  const testShip = new Ship("battleship");
  test("function scoreHit exists", () => {
    expect(typeof testShip.scoreHit).toBe("function");
  });

  test("apply hit to ship", () => {
    testShip.scoreHit();
    expect(testShip.hitCount).toBe(1);
    testShip.scoreHit();
    expect(testShip.hitCount).toBe(2);
  });

  test("battleship can be sunk", () => {
    const testShip2 = new Ship("battleship");
    for (let i = 0; i < 5; i++) {
      testShip2.scoreHit();
    }
    expect(testShip2.isSunk).toBe(true);
  });
});
