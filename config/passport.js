const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Donor = require("../models/donor"); // Donor collection
const Receiver = require("../models/receiver"); // Receiver collection

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true, // Required to access req.customRedirect
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const redirectUrl = req.query.state; // Passed from frontend

        let user;
        if (redirectUrl.includes("donor")) {
          // Check in Donor collection
          user = await Donor.findOne({ emailAddress: profile.emails[0].value });
          if (!user) {
            user = await Donor.create({
              name: profile.displayName,
              emailAddress: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              googleId: profile.id,
            });
          }
        } else if (redirectUrl.includes("receiver")) {
          // Check in Receiver collection
          user = await Receiver.findOne({ emailAddress: profile.emails[0].value });
          if (!user) {
            user = await Receiver.create({
              name: profile.displayName,
              emailAddress: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              googleId: profile.id,
            });
          }
        } else {
          return done(new Error("Invalid redirect parameter"), null);
        }

        user.customRedirect = redirectUrl; // Store redirect info
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
