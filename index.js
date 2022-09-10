require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// word for on must be as a lower case
io.on("connection", (socket) => {
  console.log("connection...");
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("Your is join room: " + room);
  });

  socket.on("enter_room", (data) => {
    console.log(data.text, " Has Enter The Room...");
    socket.to(data.room).emit("Who_enter_room", data.text);
  });

  socket.on("send_message", (data) => {
    console.log("Recived FullData: ", data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", (data) => {
    console.log(data.text, " Has Left...");
    socket.to(data.room).emit("Who_left_room", data.text);
  });

  // word for on must be as a lower case
  socket.on("disconnect", () => {
    console.log("DisConnect...");
  });
});

server.listen(3001, () => {
  console.log("Server is Running on 3001");
});
