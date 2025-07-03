import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // or your frontend port
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected :", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User : ${socket.id} Joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    io.in(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
