const express = require("express");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleRoutes = express.Router();
const { tokenModel, userModel } = require("../models/UserModel");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
//
googleRoutes.use(cookieParser());
//
passport.use(
  new GoogleStrategy(
    {
      /*
       */
      clientID:
        "956948386454-mpt1tvpatpoci84m2duipfnsfu0vuegb.apps.googleusercontent.com" ||
        process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        "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" ||
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_DOMAIN + "/auth/linkedin/callback",
      profileFields: ["id", "emails", "name", "photos"], //This
    },
    function (accessToken, refreshToken, profile, cb) {
      //
      const name = profile["displayName"];
      const email = profile["emails"][0].value;
      const photo = profile["photos"][0].value;
      const provider = profile["provider"];
      //
      return cb(null, { status: "logged-in", name, email, photo, provider });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
googleRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRoutes.get(
  "https://reg-sys-passport.onrender.com/auth/google/callback",
  (req, res) => {
    res.send("sdhhhsdskj");
  }
);

googleRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://reg-sys-passport.onrender.com/auth",
  }),
  (req, res) => {
    res.redirect("https://reg-sys-passport.onrender.com/");
  }
);

module.exports = googleRoutes;
