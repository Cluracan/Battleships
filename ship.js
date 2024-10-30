import { availableShips } from "./battleships-config";

export class Ship {
  #name;
  #length;
  #code;
  #hitCount;
  #isSunk;
  constructor(shipName) {
    if (!Object.keys(availableShips).includes(shipName)) {
      throw new Error(`Cannot create ship, input ${shipName}`);
    }
    this.#name = shipName;
    this.#length = availableShips[shipName].length;
    this.#code = availableShips[shipName].code;
    this.#hitCount = 0;
    this.#isSunk = false;
  }

  get name() {
    return this.#name;
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
  get code() {
    return this.#code;
  }
  scoreHit() {
    this.#hitCount++;
    if (this.#hitCount === this.#length) {
      this.#isSunk = true;
    }
  }
}
