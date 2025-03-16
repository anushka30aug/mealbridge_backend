const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenVerification = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: true, message: "Invalid or missing authentication token" });
        }

        const token = authHeader.split(" ")[1];
        const decodedUser = jwt.verify(token, JWT_SECRET);
        req.user = decodedUser;

        return next();
    } catch (err) {
        return res.status(401).json({ error: true, message: "Authentication failed" });
    }
};

module.exports = tokenVerification;
