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
      callbackURL: process.env.REDIRECT_DOMAIN + "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
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
  passport.authenticate("github", { failureRedirect: "/auth" }),
  function (req, res) {
    console.log("Successful authentication -github.");
    res.redirect("/");
  }
);
module.exports = githubRoutes;
