import { availableShips, gridSize } from "./game-logic/battleships-config.mjs";
import getGameboardDiv from "./gameBoardDiv.mjs";
import { cleanContent } from "./utils.mjs";

export default function insertBuildFleetContent(
  headerContent,
  leftContent,
  rightContent,
  footerContent
) {
  //Variables
  let availableShipList = [];
  let placedShipList = [];
  let selectedShipDiv;

  //Clean divs
  cleanContent(headerContent, leftContent, rightContent, footerContent);

  //Header
  headerContent.appendChild(getMarvinDiv());
  headerContent.appendChild(getTitleDiv());

  //Left content
  const shipSelectContainer = document.createElement("div");
  shipSelectContainer.setAttribute("id", "ship-select-container");
  leftContent.appendChild(shipSelectContainer);

  //Right content
  const { gameboardDiv, playCells } = getGameboardDiv("player");
  playCells.forEach((playCell) => {
    playCell.addEventListener("mouseover", handleMouseOver);
    playCell.addEventListener("mouseout", handleMouseOut);
  });

  rightContent.appendChild(gameboardDiv);

  //resetContent
  availableShipList = Object.values(availableShips);
  for (const shipData of availableShipList) {
    const shipDiv = getShipDiv(shipData);
    shipDiv.addEventListener("mousedown", handleMouseDown);
    shipSelectContainer.appendChild(shipDiv);
  }

  //mouse functions
  function handleMouseDown(e) {
    selectedShipDiv = e.target.parentNode;
    const shipPartIndex = parseInt(e.target.dataset.shipPartIndex);
    selectedShipDiv.dataset.selectedPartIndex = shipPartIndex;

    const bounds = selectedShipDiv.getBoundingClientRect();

    selectedShipDiv.dataset.height = bounds.height;
    selectedShipDiv.dataset.width = bounds.width;
    selectedShipDiv.style.pointerEvents = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(e) {
    selectedShipDiv.style.position = "absolute";
    let { xOffset, yOffset } = getOffset(selectedShipDiv);

    selectedShipDiv.style.left = `${e.clientX - xOffset}px`;
    selectedShipDiv.style.top = `${e.clientY - yOffset}px`;

    window.addEventListener("wheel", handleMouseWheel);
  }
  function handleMouseWheel(e) {
    if (selectedShipDiv.classList.contains("rotate1")) {
      selectedShipDiv.classList.remove("rotate1");
    } else {
      selectedShipDiv.classList.add("rotate1");
    }
    let { xOffset, yOffset } = getOffset(selectedShipDiv);

    selectedShipDiv.style.left = `${e.clientX - xOffset}px`;
    selectedShipDiv.style.top = `${e.clientY - yOffset}px`;

    if (e.target.classList.contains("play-cell")) {
      handleMouseOver(e);
    }
  }
  function handleMouseUp(e) {
    if (e.target.classList.contains("play-cell") && selectedShipDiv) {
      const curRow = parseInt(e.target.dataset.rowIndex);
      const curCol = parseInt(e.target.dataset.colIndex);
      let potentialShipCells = getShipCoordinates(curRow, curCol);
      if (freeCellCheck(potentialShipCells)) {
        highlightCells(potentialShipCells, null);
        insertShip(potentialShipCells);
      }
      selectedShipDiv.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleMouseWheel);
    }
  }
  function getOffset(selectedShipDiv) {
    let xOffset, yOffset;
    const shipLength = parseInt(selectedShipDiv.dataset.shipLength);
    if (selectedShipDiv.classList.contains("rotate1")) {
      xOffset =
        (shipLength / 2 - parseInt(selectedShipDiv.dataset.selectedPartIndex)) *
        parseInt(selectedShipDiv.dataset.width);
      yOffset = parseInt(selectedShipDiv.dataset.height) / 2;
    } else {
      xOffset = parseInt(selectedShipDiv.dataset.width) / 2;
      yOffset =
        ((parseInt(selectedShipDiv.dataset.selectedPartIndex) + 0.5) /
          shipLength) *
        parseInt(selectedShipDiv.dataset.height);
    }
    return { xOffset, yOffset };
  }

  function handleMouseOver(e) {
    console.log("looking");
    console.log(this);
    console.log(e.target);
    if (selectedShipDiv) {
      const curRow = parseInt(e.target.dataset.rowIndex);
      const curCol = parseInt(e.target.dataset.colIndex);
      let potentialShipCells = getShipCoordinates(curRow, curCol);
      if (freeCellCheck(potentialShipCells)) {
        console.log("good");
        highlightCells(potentialShipCells, "green");
      } else {
        potentialShipCells = potentialShipCells.filter((cell) => {
          console.log(cell);
          console.log(gridSize);
          return (
            cell.row >= 0 &&
            cell.row < gridSize &&
            cell.col >= 0 &&
            cell.col < gridSize
          );
        });
        console.log(potentialShipCells);
        highlightCells(potentialShipCells, "red");
        console.log("bad");
      }

      if (selectedShipDiv.classList.contains("rotate1")) {
        console.log("rotated");
      } else {
        console.log("vert");
      }
    }
  }
  function handleMouseOut(e) {
    playCells.forEach((cell) => {
      cell.classList.remove("highlight-red");
      cell.classList.remove("highlight-green");
    });
  }

  function getShipCoordinates(curRow, curCol) {
    let shipLength = parseInt(selectedShipDiv.dataset.shipLength);
    let shipPartIndex = parseInt(selectedShipDiv.dataset.selectedPartIndex);
    let shipCoordinates = [];
    for (let i = 0; i < shipLength; i++) {
      if (selectedShipDiv.classList.contains("rotate1")) {
        shipCoordinates.push({
          row: curRow,
          col: curCol - shipLength + shipPartIndex + i + 1,
        });
      } else {
        shipCoordinates.push({ row: curRow - shipPartIndex + i, col: curCol });
      }
    }
    return shipCoordinates;
  }

  function freeCellCheck(potentialShipCells) {
    let freeCheck = true;
    potentialShipCells.forEach(({ row, col }) => {
      //out of bounds
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        freeCheck = false;
      } else {
        //ship placed
        let curCell = playCells.find(
          (cell) =>
            parseInt(cell.dataset.rowIndex) === row &&
            parseInt(cell.dataset.colIndex) === col
        );
        if (curCell.dataset.shipPlaced === "true") {
          freeCheck = false;
        }
      }
    });
    return freeCheck;
  }

  function highlightCells(potentialShipCells, color) {
    playCells.forEach((cell) => {
      cell.classList.remove("highlight-red");
      cell.classList.remove("highlight-green");
    });
    if (color != null) {
      potentialShipCells.forEach((cell) => {
        const playCellIndex = cell.row * 10 + cell.col;
        playCells[playCellIndex].classList.add(`highlight-${color}`);
      });
    }
  }

  function insertShip(potentialShipCells) {
    const shipId = selectedShipDiv.id;
    const shipLength = selectedShipDiv.dataset.shipLength;
    console.log(shipId, shipLength);
    potentialShipCells.forEach((cell, i) => {
      const playCellIndex = cell.row * 10 + cell.col;
      if (selectedShipDiv.classList.contains("rotate1")) {
        playCells[playCellIndex].classList.add(
          `${shipId}${shipLength - 1 - i}`
        );
        playCells[playCellIndex].classList.add("rotate1");
      } else {
        playCells[playCellIndex].classList.add(`${shipId}${i}`);
      }
    });
  }

  const startBtn = document.createElement("button");
  startBtn.textContent = "START";
  startBtn.addEventListener("click", (e) => {});
  footerContent.textContent = "Footer";
}

function getShipDiv(shipData) {
  const shipDiv = document.createElement("div");
  shipDiv.setAttribute("id", shipData.id);
  shipDiv.dataset.shipLength = shipData.length;
  for (let i = 0; i < shipData.length; i++) {
    const shipPart = document.createElement("div");
    shipPart.classList.add("ship-part");
    shipPart.classList.add(`${shipData.id}${i}`);
    shipPart.dataset.shipPartIndex = i;
    shipDiv.appendChild(shipPart);
  }
  return shipDiv;
}

function getMarvinDiv() {
  const marvinDiv = document.createElement("div");
  marvinDiv.setAttribute("id", "marvin-div");
  const marvinImg = document.createElement("img");
  marvinImg.src = "./images/marvin.svg";
  marvinDiv.appendChild(marvinImg);
  const instructionsDiv = document.createElement("div");
  instructionsDiv.setAttribute("id", "instructionsText");
  instructionsDiv.textContent = "testing";
  marvinDiv.appendChild(instructionsDiv);
  return marvinDiv;
}

function getTitleDiv() {
  const titleDiv = document.createElement("div");
  titleDiv.setAttribute("id", "title-text");
  titleDiv.textContent = "Battleships";
  return titleDiv;
}
