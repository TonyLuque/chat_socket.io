const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require("dotenv").config();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", async (socket) => {
  console.log("Se conecto un usuario");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Se puede usar solo el io para emitir por fuera de la conexion
(async function () {
  let count = 0;
  while (count < 10) {
    io.emit("notification", count);
    console.log(count);
    count++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
})();

server.listen(process.env.PORT, () => {
  console.log(`server listen in port ${process.env.PORT}`);
});
