const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const linkedinRoutes = express.Router();
const { tokenModel, userModel } = require("../models/UserModel");
const dotenv = require("dotenv");
dotenv.config();
//
linkedinRoutes.use(cookieParser());
//
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_ID || "86dc7t51wg2bed",
      clientSecret: process.env.LINKEDIN_SECRET || "Tkjw6TomgBLj2tvL",
      callbackURL:
        process.env.LINKEDIN_REDIRECT ||
        "http://localhost:3000/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        //console.log("user found : " + JSON.stringify(profile));
        console.log("user found : --linkedin  ");
        return done(null, profile);
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
linkedinRoutes.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/auth",
  })
);

linkedinRoutes.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" }),
  function (req, res) {
    console.log("req.user : " + JSON.stringify(req.user));
  }
);
module.exports = linkedinRoutes;
