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
  leftContent.textContent = "your board";
  rightContent.textContent = "button options";
  const startBtn = document.createElement("button");
  startBtn.textContent = "START";
  startBtn.addEventListener("click", (e) => {
    console.log("start");
  });
  footerContent.appendChild(startBtn);
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
