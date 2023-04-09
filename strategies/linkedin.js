const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const linkedinRoutes = express.Router();
const { tokenModel, userModel } = require("../models/UserModel");
const dotenv = require("dotenv").config();
//
linkedinRoutes.use(cookieParser());
//
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_ID || "86dc7t51wg2bed",
      clientSecret: process.env.LINKEDIN_SECRET || "Tkjw6TomgBLj2tvL",
      callbackURL: process.env.REDIRECT_DOMAIN + "/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        //
        const name = profile["displayName"];
        const email = profile["emails"][0].value;
        const photo = profile["photos"][0].value;
        const provider = profile["provider"];
        //
        return done(null, {
          status: "logged-in",
          name,
          email,
          photo,
          provider,
        });
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
  function (req, res) {}
);
module.exports = linkedinRoutes;
