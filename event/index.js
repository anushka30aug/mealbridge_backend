const userConnection = require("./user_connection");
const { setupMealEvents } = require("./meal_events");

const registerSocketHandlers = (io) => {
  setupMealEvents(io); // Initialize meal event handler with io

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
