import { availableShips } from "./game-logic/battleships-config.mjs";
import getGameboardDiv from "./gameBoardDiv.mjs";

export default function insertBuildFleetContent() {
  const headerContent = document.getElementById("header-content");
  const leftContent = document.getElementById("left-content");
  const rightContent = document.getElementById("right-content");
  const footerContent = document.getElementById("footer-content");
  for (const contentDiv of [
    headerContent,
    leftContent,
    rightContent,
    footerContent,
  ]) {
    while (contentDiv.firstChild) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
  }

  headerContent.appendChild(getMarvinDiv());
  headerContent.appendChild(getTitleDiv());

  const shipSelectContainer = document.createElement("div");
  shipSelectContainer.setAttribute("id", "ship-select-container");

  for (const shipData of Object.values(availableShips)) {
    const shipDiv = getShipDiv(shipData);
    shipDiv.addEventListener("mousedown", handleMouseDown);

    shipSelectContainer.appendChild(shipDiv);
  }

  let shipDiv;
  //mouse functions
  function handleMouseDown(e) {
    shipDiv = e.target.parentNode;
    const shipPartIndex = parseInt(e.target.dataset.shipPartIndex);
    shipDiv.dataset.selectedPartIndex = shipPartIndex;

    const bounds = shipDiv.getBoundingClientRect();

    shipDiv.dataset.height = bounds.height;
    shipDiv.dataset.width = bounds.width;
    shipDiv.style.pointerEvents = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(e) {
    shipDiv.style.position = "absolute";
    let { xOffset, yOffset } = getOffset(shipDiv);
    console.log({ xOffset, yOffset });
    shipDiv.style.left = `${e.clientX - xOffset}px`;
    shipDiv.style.top = `${e.clientY - yOffset}px`;

    window.addEventListener("wheel", handleMouseWheel);
  }
  function handleMouseWheel(e) {
    if (shipDiv.classList.contains("rotate1")) {
      shipDiv.classList.remove("rotate1");
    } else {
      shipDiv.classList.add("rotate1");
    }
    let { xOffset, yOffset } = getOffset(shipDiv);

    shipDiv.style.left = `${e.clientX - xOffset}px`;
    shipDiv.style.top = `${e.clientY - yOffset}px`;
  }
  function handleMouseUp(e) {
    shipDiv.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("wheel", handleMouseWheel);
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

  leftContent.appendChild(shipSelectContainer);

  const { gameboardDiv, playCells } = getGameboardDiv("player");
  playCells.forEach((playCell) => {
    playCell.addEventListener("mouseover", handleMouseOver);
  });

  rightContent.appendChild(gameboardDiv);

  function handleMouseOver(e) {
    console.log(this);
    this.style.background = "pink";
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
