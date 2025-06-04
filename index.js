require("dotenv").config();
require("./config/passport");
require("./jobs");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const main = require("./config/connect");
const app = express();
const port = 3001;
const session = require("express-session");
const server = http.createServer(app);
const sendResponse = require("./utils/send_response");
const registerSocketHandlers = require("./event");
const passport = require("passport");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3000"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: { origin: "*" },
  methods: ["GET", "POST", "PUT"],
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
app.use("/meal", require("./routes/meals/otp"));

registerSocketHandlers(io);

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
