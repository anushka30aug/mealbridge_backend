const userConnection = (socket, io) => {
  socket.on("donor_connected", (userId) => {
    console.log(`Donor connected: ${userId}`);
    socket.join(userId); // Join a room named after donor ID
  });

  socket.on("collector_connected", (userId) => {
    console.log(`Collector connected: ${userId}`);
    socket.join(userId); // Join a room named after collector ID
  });
};

module.exports = userConnection;
