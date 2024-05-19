const socketIo = require("socket.io");
const { IOTokenVerification } = require("../middlewares/TokenHandeler");

const corsOptions = {
  origin: "http://localhost:3000",
};
const initializeSocket = (server) => {
  const Rooms = {};

  const io = socketIo(server, {
    cors: corsOptions,
  });

  io.use(IOTokenVerification);

  io.on("connection", (socket) => {
    console.log(socket.handshake.auth.token);
    // check for the users in the meeting and the room and if there is no on in the meeting one will be created
    socket.on("check", (roomId) => {
      socket.join(roomId);
      if (Rooms[roomId]) {
        const users = Rooms[roomId];
        const list = Array.from(users);
        socket.emit(
          "check",
          list.filter((id) => id != socket.id)
        );
        users.add(socket.id);
        Rooms[roomId] = users;
      } else {
        Rooms[roomId] = new Set([socket.id]);
        socket.emit("check", []);
      }
    });

    // calling each and every user in the stream
    socket.on("calluser", (message) => {
      io.to(message.userToCall).emit("calluser", message);
    });

    // response to the call request
    socket.on("answercall", (data) => {
      io.to(data.to).emit("callaccepted", { signal: data.signal, id: data.id });
    });

    // sending Meeting texts
    socket.on("message", (data) => {
      socket
        .to(data.roomId)
        .emit("message", { message: data.message, id: socket.id });
    });
    socket.on("disconnect", () => {
      // const users = Rooms[roomId];
      // users.delete(socket.id);
      // Rooms[roomId] = users;
      // console.log("Disconnected");
    });
  });

  return io;
};

module.exports = initializeSocket;
