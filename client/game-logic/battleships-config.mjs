const availableShips = [
  { name: "Carrier", length: 5, code: "C", id: "carrier" },

  { name: "Battleship", length: 4, code: "B", id: "battleship" },
  { name: "Destroyer", length: 3, code: "D", id: "destroyer" },
  { name: "Submarine", length: 3, code: "S", id: "submarine" },
  { name: "Patrol boat", length: 2, code: "P", id: "patrol" },
];

const gridSize = 10;

export { availableShips, gridSize };

//'code' key currently unused:) but leaving these as objects to allow for 'quantity' (would need refactoring obviously
