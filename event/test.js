// import { Server, Socket } from "socket.io";

const foodSocketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);

    socket.on("donor", (message) =>{
        console.log(`User connected: ${message}`);
        io.emit("catchdonor" , message);
    });
    socket.on("ngo", (message) =>{
        console.log(`User connected: ${message}`);
        io.emit("catchngo" , message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};


module.exports =  foodSocketHandler;
