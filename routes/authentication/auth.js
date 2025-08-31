// auth.js
const express = require("express");
const passport = require("passport");
const Router = express.Router();
const jwt = require("jsonwebtoken");

let MEALBRIDGE_DONATE = "http://localhost:3002";
let MEALBRIDGE_COLLECTOR = "http://localhost:3000";

if (process.env.ENV === "production") {
  MEALBRIDGE_DONATE = process.env.MEALBRIDGE_DONATE;
  MEALBRIDGE_COLLECTOR = process.env.MEALBRIDGE_COLLECTOR;
}

Router.get("/failed", (req, res) => {
  const state = req.query.state;
  let redirectUrl;

  if (state === "donor") redirectUrl = MEALBRIDGE_DONATE;
  else if (state === "collector") redirectUrl = MEALBRIDGE_COLLECTOR;
  else redirectUrl = MEALBRIDGE_COLLECTOR;

  res.redirect(redirectUrl);
});

Router.get("/google", (req, res, next) => {
  const frontendRedirect = req.query.state;
  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: frontendRedirect,
  })(req, res, next);
});

Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  (req, res) => {
    const payload = { userId: req.user._id };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret);
    const redirectUrl = req.user.customRedirect;
    res.redirect(`${redirectUrl}?token=${token}`);
  }
);

module.exports = Router;
