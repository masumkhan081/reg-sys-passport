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
      callbackURL: "http://localhost:3000/auth/google/callback",
      profileFields: ["id", "emails", "name", "photos"], //This
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log("dn:  " + JSON.stringify(profile));
      done(null, profile);
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
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  function (req, res) {
    console.log("successfull auth: " + JSON.stringify(req.user));
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = googleRoutes;
