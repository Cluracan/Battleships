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
  const battleshipDiv = getBattleshipDiv();
  battleshipDiv.setAttribute("id", "battleship");
  // battleshipDiv.classList.add("rotate1");
  battleshipDiv.addEventListener("mousedown", handleMouseDown);
  shipSelectContainer.appendChild(battleshipDiv);

  //mouse functions
  function handleMouseDown(e) {
    const shipPartIndex = parseInt(e.target.dataset.shipPartIndex);
    battleshipDiv.dataset.selectedPartIndex = shipPartIndex;

    const bounds = battleshipDiv.getBoundingClientRect();

    battleshipDiv.dataset.height = bounds.height;
    battleshipDiv.dataset.width = bounds.width;
    battleshipDiv.style.pointerEvents = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(e) {
    battleshipDiv.style.position = "absolute";
    let { xOffset, yOffset } = getOffset(battleshipDiv);
    battleshipDiv.style.left = `${e.clientX - xOffset}px`;
    battleshipDiv.style.top = `${e.clientY - yOffset}px`;

    window.addEventListener("wheel", handleMouseWheel);
  }
  function handleMouseWheel(e) {
    if (battleshipDiv.classList.contains("rotate1")) {
      battleshipDiv.classList.remove("rotate1");
    } else {
      battleshipDiv.classList.add("rotate1");
    }
    let { xOffset, yOffset } = getOffset(battleshipDiv);

    battleshipDiv.style.left = `${e.clientX - xOffset}px`;
    battleshipDiv.style.top = `${e.clientY - yOffset}px`;
  }
  function handleMouseUp(e) {
    battleshipDiv.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("wheel", handleMouseWheel);
  }

  function getOffset(selectedShipDiv) {
    let xOffset, yOffset;
    const shipLength = selectedShipDiv.dataset.shipLength;
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

function getBattleshipDiv() {
  const battleshipDiv = document.createElement("div");
  battleshipDiv.dataset.shipLength = 4;
  for (let i = 0; i < 4; i++) {
    const shipPart = document.createElement("div");
    shipPart.classList.add("ship-part");
    shipPart.classList.add(`battleship${i}`);
    shipPart.dataset.shipPartIndex = i;
    battleshipDiv.appendChild(shipPart);
  }
  return battleshipDiv;
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
