require("dotenv").config();
require("./config/passport");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const main = require("./config/connect");
const app = express();
const port = 3001;
const session = require("express-session");
const mongoose = require("mongoose");
const server = http.createServer(app);
const sendResponse = require("./utils/send_response");

const foodSocketHandler = require("./event/test");

const cron = require("node-cron");
const passport = require("passport");
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/authentication", require("./routes/authentication/auth"));
app.use("/user", require("./routes/universal/user/profile"));
app.use("/donor", require("./routes/donor/donation"));
app.use("/donor", require("./routes/donor/profile"));
app.use("/collector", require("./routes/collector/collection"));
app.use("/collector", require("./routes/collector/profile"));

cron.schedule("5 * * * * *", () => {
  console.log("cronjob");
});

foodSocketHandler(io);

app.use((err, req, res, next) => {
  console.error(err.stack);
  sendResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error"
  );
});

server.listen(port, () => {
  console.log(`MealBridge is running on port: http://localhost:${port}`);
});
