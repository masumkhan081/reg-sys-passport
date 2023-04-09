const express = require("express");
const passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
const fbRoutes = express.Router();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
//
fbRoutes.use(cookieParser());
//
passport.use(
  new FacebookStrategy(
    {
      // "867214991392967" ||
      // "1fdcdec9cc67718ae47b42af5dad77e0" ||
      clientID: process.env.META_APP_ID,
      clientSecret: process.env.META_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      //
      const name = profile["displayName"];
      const email = profile["emails"][0].value;
      const photo = profile["photos"][0].value;
      const provider = profile["provider"];
      //
      return cb(null, {
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

fbRoutes.get("/auth/facebook", passport.authenticate("facebook"));

fbRoutes.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth" }),
  function (req, res) {
    console.log("Successful authentication");
    res.redirect("/");
  }
);
module.exports = fbRoutes;
