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
import { WebSocketServer } from "ws";
//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer((req, res) =>
  console.log("we have received a request")
);

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const wsServer = new WebSocketServer({
  httpServer: httpserver,
});
