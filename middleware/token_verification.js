const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/send_response");
const ServerError = require("../utils/server_error");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenVerification = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ServerError("Invalid or missing authentication token", 401);
    }

    const token = authHeader.split(" ")[1];
    const decodedUser = jwt.verify(token, JWT_SECRET);
    req.user = decodedUser;

    return next();
  } catch (error) {
    return sendResponse(
      res,
      error.statusCode,
      error.message || "Internal Server Error"
    );
  }
};

module.exports = tokenVerification;
