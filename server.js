const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
//set static folder
app.use(express.static("./public"));
const chatName = "Chat Code";
//Run when client connects
io.on("connection", (socket) => {
  //chat room
  socket.on("chat-room", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //send messages to clients
    socket.emit("message", formatMessage(chatName, "Welcome to chat code"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatName, `${user.username} has join the chat`)
      );

    //send room and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  //listen for chat msg
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  //Runs when client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatName, `${user.username} has left the chat`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
  // //all the clients
  // io.emit();
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
