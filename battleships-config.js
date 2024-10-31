const availableShips = {
  carrier: { length: 5, code: "C" },
  battleship: { length: 4, code: "B" },
  destroyer: { length: 3, code: "D" },
  submarine: { length: 3, code: "S" },
  "patrol boat": { length: 2, code: "P" },
};

export { availableShips };

//'code' depreciated :) but leaving these as objects to allow for 'quantity' (would need refactoring obviously
