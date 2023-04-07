const express = require("express");
const passport = require("passport");
var GithubStrategy = require("passport-github2").Strategy;
const githubRoutes = express.Router();
const { tokenModel, userModel } = require("../models/UserModel");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
//
githubRoutes.use(cookieParser());
//
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("user- github: " + JSON.stringify(profile));
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

githubRoutes.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

githubRoutes.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("Successful authentication -github.");
    res.redirect("/");
  }
);
module.exports = githubRoutes;
