// auth.js
const express = require("express");
const passport = require("passport");
const Router = express.Router();
const jwt = require("jsonwebtoken");

Router.get("/failed", (req, res) => {
  // const redirectUrl = req.user.customRedirect || process.env.DEFAULT_CLIENT_URI;
  res.redirect(`http://localhost:3000`);
});

Router.get("/google", (req, res, next) => {
  const frontendRedirect = req.query.state || process.env.DEFAULT_CLIENT_URI;
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: frontendRedirect, // Pass redirect info
  })(req, res, next);
});

Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  (req, res) => {
    const payload = { userId: req.user._id };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret);
    const redirectUrl =
      req.user.customRedirect || process.env.DEFAULT_CLIENT_URI;
    res.redirect(`${redirectUrl}?token=${token}`);
  }
);

module.exports = Router;
