const availableShips = [
  { name: "carrier", length: 5, code: "C", id: "carrier" },

  { name: "battleship", length: 4, code: "B", id: "battleship" },
  { name: "destroyer", length: 3, code: "D", id: "destroyer" },
  { name: "submarine", length: 3, code: "S", id: "submarine" },
  { name: "patrol boat", length: 2, code: "P", id: "patrol" },
];

const gridSize = 10;

export { availableShips, gridSize };

//'code' key currently unused:) but leaving these as objects to allow for 'quantity' (would need refactoring obviously
