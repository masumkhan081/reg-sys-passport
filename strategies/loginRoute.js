// const express = require("express");
// const passport = require("passport");
// var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// var GoogleStrategy = require("passport-google-oauth20").Strategy;
// const loginRoutes = express.Router();
// const { tokenModel, userModel } = require("../models/UserModel");

// const cookieParser = require("cookie-parser");
// loginRoutes.use(cookieParser());

// //
// passport.use(
//   new GoogleStrategy(
//     {
//       /*
//        */
//       clientID:
//         "1079574923229-n9os1k5vdkncmlb2hd9p4svn020vp157.apps.googleusercontent.com" ||
//         process.env.GOOGLE_CLIENT_ID,
//       clientSecret:
//         "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" ||
//         process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//       profileFields: ["id", "emails", "name", "photos"], //This
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log("dn:  " + JSON.stringify(profile));
//       done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
// loginRoutes.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// loginRoutes.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/signin" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

// loginRoutes.get("/linkedin", (req, res) => {
//   passport.use(
//     new LinkedInStrategy(
//       {
//         clientID: LINKEDIN_KEY,
//         clientSecret: LINKEDIN_SECRET,
//         callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
//         scope: ["r_emailaddress", "r_liteprofile"],
//       },
//       function (accessToken, refreshToken, profile, done) {
//         process.nextTick(function () {
//           return done(null, profile);
//         });
//       }
//     )
//   );
//   //
// });

// loginRoutes.post("/p", (req, res) => {
//   let uid = "12345uid";
//   console.log(req.cookies);
//   res.cookie("uid", uid);
//   res.send(JSON.stringify(req.cookies));
// });

// loginRoutes.get("/signin", (req, res) => {
//   res.render("login", { loggedin: true, msg: "msg !" });
// });
// loginRoutes.post("/signin", (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   userModel
//     .findOne({ email, password, verified: true })
//     .then((result) => {
//       console.log(JSON.stringify(result));
//       res.cookie("userid", { userid: result.id });
//       res.send("hvjh");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// module.exports = loginRoutes;
