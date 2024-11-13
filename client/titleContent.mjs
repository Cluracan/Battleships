import insertBuildFleetContent from "./buildFleetContent.mjs";

export default function insertTitleContent() {
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

  headerContent.textContent = "BattleShips";
  leftContent.textContent = "LeftPic";
  rightContent.textContent = "rightPic";
  const startBtn = document.createElement("button");
  startBtn.textContent = "START";
  startBtn.addEventListener("click", (e) => {
    insertBuildFleetContent(
      headerContent,
      leftContent,
      rightContent,
      footerContent
    );
  });
  footerContent.appendChild(startBtn);
}
