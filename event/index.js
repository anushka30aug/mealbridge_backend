const { setCollectorIO } = require("./collector/collector_event");
const { setDonorIO } = require("./donor/donor_event");
const userConnection = require("./user_connection");

const registerSocketHandlers = (io) => {
  setDonorIO(io);
  setCollectorIO(io);
  io.on("connection", (socket) => {
    console.log(`Socket connected : ${socket.id}`);

    // Register modular socket event handlers
    userConnection(socket, io);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = registerSocketHandlers;
