import { availableShips } from "./battleships-config.mjs";

export class Ship {
  #id;
  #name;
  #length;
  #hitCount;
  #isSunk;
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

  scoreHit() {
    this.#hitCount++;
    if (this.#hitCount === this.#length) {
      this.#isSunk = true;
    }
  }
}
