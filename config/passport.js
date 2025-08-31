const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Donor = require("../models/donor"); // Donor collection
const Collector = require("../models/collector");
const generateUniqueOtp = require("../utils/otp_generator");
const backendURL =
  process.env.ENV === "production"
    ? process.env.BACKEND_URL
    : "http://localhost:3001";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendURL}/authentication/google/callback`,
      passReqToCallback: true, // Required to access req.customRedirect
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // const redirectUrl = req.query.redirect;
        const state = req.query.state;
        // if (!redirectUrl) return done(new Error("Missing redirect URL"), null);
        if (!state) return done(new Error("Missing state parameter"), null);

        let user;
        let MEALBRIDGE_DONATE = "http://localhost:3002";
        let MEALBRIDGE_COLLECTOR = "http://localhost:3000";
        if (process.env.ENV === "production") {
          MEALBRIDGE_DONATE = process.env.MEALBRIDGE_DONATE;
          MEALBRIDGE_COLLECTOR = process.env.MEALBRIDGE_COLLECTOR;
        }

        if (state === "donor") {
          user = await Donor.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = await Donor.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
            });
          }
          user.customRedirect = MEALBRIDGE_DONATE;
        } else if (state === "collector") {
          const staticOtp = await generateUniqueOtp();
          user = await Collector.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = await Collector.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              staticOtp,
            });
          }

          user.customRedirect = MEALBRIDGE_COLLECTOR;
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
  let user = (await Donor.findById(id)) || (await Collector.findById(id));
  done(null, user);
});
