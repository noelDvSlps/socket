const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://socket-swart.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

let allData = [];

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (room) => {
    console.log(room);
    socket.join(room);
  });

  socket.on("send-message", (data) => {
    console.log(`User connected: ${socket.id}`);
    console.log(data);
    allData = [...allData, data];
    // socket.to(data.room).emit("receive-message", allData);
    io.sockets.in(data.room).emit(
      "receive-message",
      allData.filter((item) => {
        return item.room === data.room;
      })
    );
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
