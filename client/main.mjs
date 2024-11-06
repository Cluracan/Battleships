import { Gameboard } from "./game-logic/gameboard.mjs";

const checkDiv = document.getElementById("checkDiv");
checkDiv.textContent = "PLEASE EORK";

let clientId = null;
let gameId = null;
let playerColor = null;
let ws = new WebSocket("ws://192.168.1.215:9090", "test-proto");
//HTML Elements
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const divBoard = document.getElementById("divBoard");
//wiring events
btnJoin.addEventListener("click", (e) => {
  if (gameId === null) {
    gameId = txtGameId.value;
  }
  const payLoad = {
    method: "join",
    clientId: clientId,
    gameId: gameId,
  };
  ws.send(JSON.stringify(payLoad));
});
btnCreate.addEventListener("click", (e) => {
  const payLoad = {
    method: "create",
    clientId: clientId,
  };
  ws.send(JSON.stringify(payLoad));
});

//
ws.onmessage = (message) => {
  //message.data
  const response = JSON.parse(message.data);
  //connect
  if (response.method === "connect") {
    clientId = response.clientId;
    console.log(`clientId set successfully to ${clientId}`);
  }
  //create
  if (response.method === "create") {
    gameId = response.game.id;
    console.log(
      `game successfully created with ID ${response.game.id} using ${response.game.balls} balls`
    );
  }
  //join
  if (response.method === "join") {
    const game = response.game;
    //Update playerList
    while (divPlayers.firstChild) {
      divPlayers.removeChild(divPlayers.firstChild);
    }
    game.clients.forEach((c) => {
      const d = document.createElement("div");
      d.style.width = "200px";
      d.style.backgroundColor = c.color;
      d.textContent = c.clientId;
      divPlayers.appendChild(d);

      if (c.clientId === clientId) playerColor = c.color;
    });
    //Reset board
    while (divBoard.firstChild) {
      divBoard.removeChild(divBoard.firstChild);
    }
    for (let i = 0; i < game.balls; i++) {
      const b = document.createElement("button");
      b.id = `ball${i + 1}`;
      b.tag = i + 1;
      b.style.width = "150px";
      b.style.height = "150px";
      b.textContent = i;
      b.addEventListener("click", (e) => {
        //click board
        b.style.background = playerColor;
        const payLoad = {
          method: "play",
          clientId,
          gameId,
          ballId: b.tag,
          playerColor,
        };
        ws.send(JSON.stringify(payLoad));
      });
      divBoard.appendChild(b);
    }
  }

  //update
  if (response.method === "update") {
    const state = response.game.state;
    if (!state) return;
    for (const b of Object.keys(state)) {
      const color = state[b];
      const ballObject = document.getElementById(`ball${b}`);
      ballObject.style.backgroundColor = color;
    }
  }
};
