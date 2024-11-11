const availableShips = {
  carrier: { length: 5, code: "C", id: "carrier" },
  battleship: { length: 4, code: "B", id: "battleship" },
  destroyer: { length: 3, code: "D", id: "destroyer" },
  submarine: { length: 3, code: "S", id: "submarine" },
  "patrol boat": { length: 2, code: "P", id: "patrol" },
};

const gridSize = 10;

export { availableShips, gridSize };

//'code' key currently unused:) but leaving these as objects to allow for 'quantity' (would need refactoring obviously
