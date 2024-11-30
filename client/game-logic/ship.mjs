import { availableShips } from "./battleships-config.mjs";

export class Ship {
  #id;
  #name;
  #length;
  #hitCount;
  #isSunk;
  #allPoints;
  #orientation;
  constructor(shipId) {
    if (!availableShips.some((ship) => ship.id === shipId)) {
      throw new Error(`Cannot create ship, input ${shipId}`);
    }
    const shipData = availableShips.find((ship) => ship.id === shipId);
    this.#name = shipData.name;
    this.#length = shipData.length;
    this.#hitCount = 0;
    this.#isSunk = false;
    this.#id = shipId;
  }

  get name() {
    return this.#name;
  }
  get id() {
    return this.#id;
  }

  get length() {
    return this.#length;
  }
  get hitCount() {
    return this.#hitCount;
  }
  get isSunk() {
    return this.#isSunk;
  }
  set allPoints(allPointsArray) {
    this.#allPoints = allPointsArray;
  }
  get allPoints() {
    return this.#allPoints;
  }
  set orientation(shipOrientation) {
    this.#orientation = shipOrientation;
  }
  get orientation() {
    return this.#orientation;
  }

  scoreHit() {
    this.#hitCount++;
    if (this.#hitCount === this.#length) {
      this.#isSunk = true;
    }
  }
}
