require('dotenv').config();
const express = require('express');
const http = require('http');  
const { Server } = require("socket.io");
const main = require('./config/connect');
const Otp = require("./models/otp");
const app = express();
const port = 3001;
const mongoose = require("mongoose")
const server = http.createServer(app); 

const foodSocketHandler = require("./event/test");

const cron = require("node-cron");
const io = new Server(server, {
  cors: { origin: "*" },
});
main().then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.get('/', async (req, res) => {
  res.send('Hello world'); 
});

cron.schedule("5 * * * * *", () => {
  console.log("cronjob");
});

foodSocketHandler(io);
server.listen(port, () => {
  console.log(`MealBridge is running on port: http://localhost:${port}`);
});
