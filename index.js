require('dotenv').config();
const express = require('express');
const http = require('http');  
const { Server } = require("socket.io");
const main = require('./config/connect');

const app = express();
const port = 3001;
const server = http.createServer(app); 

const foodSocketHandler = require("./event/test");

const io = new Server(server, {
  cors: { origin: "*" },
});
main().then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.get('/', (req, res) => {
  res.send('Hello world');
});

foodSocketHandler(io);
server.listen(port, () => {
  console.log(`MealBridge is running on port: http://localhost:${port}`);
});
