const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Donor = require("../models/donor"); // Donor collection
const Receiver = require("../models/receiver"); // Receiver collection

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/mealbridge/authentication/google/callback",
      passReqToCallback: true, // Required to access req.customRedirect
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // const redirectUrl = req.query.redirect; 
        const state = req.query.state;
        // if (!redirectUrl) return done(new Error("Missing redirect URL"), null);
        if (!state) return done(new Error("Missing state parameter"), null);

        let user;
        if (state === "donor") {
          user = await Donor.findOne({ emailAddress: profile.emails[0].value });
          if (!user) {
            user = await Donor.create({
              name: profile.displayName,
              emailAddress: profile.emails[0].value, 
              profilePicture: profile.photos[0].value,
              googleId: profile.id,
            });
          }
          user.customRedirect = `http://localhost:3000`;
        } else if (state === "receiver") {
          user = await Receiver.findOne({ emailAddress: profile.emails[0].value });
          if (!user) {
            user = await Receiver.create({
              name: profile.displayName,
              emailAddress: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              googleId: profile.id,
            });
          }
          user.customRedirect = `http://localhost:3002`;
        } else {
          return done(new Error("Invalid state parameter"), null);
        }

        // user.customRedirect = redirectUrl; 
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  let user = await Donor.findById(id) || await Receiver.findById(id);
  done(null, user);
});
