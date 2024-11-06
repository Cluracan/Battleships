const http = require("http");
const { hostname } = require("os");
const express = require("express");
const app = express();
app.use(express.static(__dirname + "/client"));

app.listen(9091, () => console.log("listening on port 9091"));
app.get("/", (req, res) => {
  //   console.log(req);
  res.sendFile(__dirname + "/index.html");
});
const WebSocketServer = require("websocket").server;

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer((req, res) =>
  console.log("we have received a request")
);

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const wsServer = new WebSocketServer({
  httpServer: httpserver,
});

httpserver.listen(9090, hostname, () =>
  console.log(`My server is listening at ${hostname} on port 9090`)
);

//hashmaps
const clients = {};
const games = {};
//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it!

wsServer.on("request", (request) => {
  //connect
  const connection = request.accept("test-proto", request.origin); //test-proto = string (or array of strings) that client must include one of in order to establish connection
  connection.on("open", () => console.log("connection opened"));
  connection.on("close", () => console.log("connection closed"));
  connection.on("message", (message) => {
    const result = JSON.parse(message.utf8Data);

    //received a message from client
    //create new game
    if (result.method === "create") {
      const clientId = result.clientId;
      const gameId = guid();
      games[gameId] = {
        id: gameId,
        balls: 20,
        clients: [],
      };
      const payLoad = {
        method: "create",
        game: games[gameId],
      };
      console.log("creating new game:");
      console.log(gameId);
      const connection = clients[clientId].connection;
      connection.send(JSON.stringify(payLoad));
    }
    //join new game
    if (result.method === "join") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];
      if (game.clients.length >= 3) {
        //max players reached
        return;
      }
      const color = { 0: "Red", 1: "green", 2: "blue" }[game.clients.length];
      game.clients.push({
        clientId: clientId,
        color,
      });
      //start the game with 3 clients
      if (game.clients.length === 2) updateGameState();

      const payLoad = {
        method: "join",
        game,
      };
      //loop through all clients and tell them new player has joined
      game.clients.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      });
    }
    //play game
    if (result.method === "play") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const ballId = result.ballId;
      const playerColor = result.playerColor;
      let state = games[gameId].state;
      if (!state) state = {};
      state[ballId] = playerColor;
      games[gameId].state = state;
      const game = games[gameId];
      const payLoad = {
        method: "play",
        game,
      };
    }
  });

  console.log("Default (initial connect)");
  console.log(request);
  //generate a new clientId
  const clientId = guid();
  clients[clientId] = {
    connection: connection,
  };

  const payLoad = {
    method: "connect",
    clientId: clientId,
  };
  //send back the client connect
  connection.send(JSON.stringify(payLoad));
});

function updateGameState() {
  for (const g of Object.keys(games)) {
    const game = games[g];
    const payLoad = {
      method: "update",
      game,
    };
    games[g].clients.forEach((c) => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    });
  }
  setTimeout(updateGameState, 500);
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
