"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingTimeout: 20000000,
  pingInterval: 1000
});
const m = require("moment");
const bodyParser = require("body-parser");
const apiai = require("apiai")(process.env.APIAI_TOKEN);
const port = process.env.PORT || 2626;


server.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/main", (_, res) => {
  res.sendFile(__dirname + "/views/main.html");
});



io.on("connection", (socket) => {
  let num = socket.client.conn.server.clientsCount;
  console.log(socket.id + num +"connected!");
  socket


  socket.emit("ai message", {
    msg: "こんにちは！"
  });

  socket.on("ask", () => {
    send(socket, "あなたは猫派ですか？犬派ですか？")
  })

  socket.on("human message", (msg) => {
    let apiaiReq = apiai.textRequest(msg, {
      sessionId: process.env.APIAI_SESSION_ID
    });
    apiaiReq.on("response", (response) => {
      const aiTxt = response.result.fulfillment.speech;
      send(socket, aiTxt);
    });
    apiaiReq.on("error", (err) => {
      console.error(err);
      send(socket, "エラーが発生しました．");
    });
    apiaiReq.end();
  });

  socket.on("initialize", (msg) => {
    let apiaiReq = apiai.textRequest(msg, {
      sessionId: process.env.APIAI_SESSION_ID
    });
    apiaiReq.end();
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected!");
  })
});

function send(socket, message) {
  socket.emit("ai message", {
    msg: message
  });
}