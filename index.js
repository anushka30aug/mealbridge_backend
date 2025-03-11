require('dotenv').config();
require("./config/passport"); 
const express = require('express');
const http = require('http');  
const { Server } = require("socket.io");
const main = require('./config/connect');
const app = express();
const port = 3001;
const session = require("express-session");
const mongoose = require("mongoose")
const server = http.createServer(app); 

const foodSocketHandler = require("./event/test");

const cron = require("node-cron");
const passport = require('passport');
const io = new Server(server, {
  cors: { origin: "*" },
});
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
app.use(passport.initialize());
app.use(passport.session());
main().then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.get('/',  (req, res) => {
  res.send('Hello world'); 
});
// redirect=${encodeURIComponent(FRONTEND_URL)}

app.use("/mealbridge/authentication", require("./routes/auth"));

cron.schedule("5 * * * * *", () => {
  console.log("cronjob");
});

foodSocketHandler(io);
server.listen(port, () => {
  console.log(`MealBridge is running on port: http://localhost:${port}`);
});
