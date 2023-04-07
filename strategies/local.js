// required packages, models, instances
const express = require("express");
const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { tokenModel, userModel } = require("../models/UserModel");
const local = express.Router();
const { sendEmail } = require("../controller/emailSender");
const { do_check } = require("../controller/validate");
const { get_calculatedTime } = require("./verify");
const dotenv = require("dotenv");
dotenv.config();

//
passport.use(
  new LocalStrategy(function (username, password, done) {
    userModel.findOne({ email: username, password }, function (err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        console.log("no user .. found");
        return done(null, { status: "null", email: username });
      } else if (user.verified == false) {
        console.log("not verified ...");
        return done(null, { status: "not-verified", email: username });
      } else {
        return done(null, user);
      }
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

//     -----------------------------------------------       SIGN IN
local.post("/auth/signin", passport.authenticate("local"), (req, res) => {
  console.log("async:         ", JSON.stringify(req.user));
  if (req.user.status == "null") {
    res.render("authPage", {
      errors: ["No account associated with this email"],
      email: req.body.username,
      password: req.body.password,
      loggedin: false,
    });
  } else if (req.user.status == "not-verified") {
    res.redirect("/auth/verification");
    // res.render("sendVerification", {
    //   loggedin: false,
    //   msg: "Account found but not verified. ",
    //   email: req.body.username,
    // });
  } else {
    res.redirect("/");
  }
});

local.post("/auth/signin/verify", async (req, res) => {
  const { email } = req.body;

  userModel.findOne({ email: email }, function (err, doc) {
    const userId = doc._id;
    console.log(doc._id + "         doc:   " + JSON.stringify(doc));
    //
    //   masumkhan.medilifesolution@gmail.com      masumkhan.medilifesolutionnn@gmail.com
    //
    const token = crypto.createHash("sha256").update(email).digest("hex");
    const expires = get_calculatedTime();
    //
    let newToken = new tokenModel({
      userId,
      token: token,
      expires,
    })
      .save()
      .then((savedToken) => {
        console.log("tkn:  " + savedToken.token);
        const message = `${process.env.BASE_URL}/auth/verify/${userId}/${savedToken.token}`;
        sendEmail(email, "Verify Email", message)
          .then((result) =>
            res.render("plzVerify", {
              email: email,
              loggedin: false,
            })
          )
          .catch((err) => console.log("error sending verification email"));
      })
      .catch((err) =>
        console.log("error saving new token in db  " + JSON.stringify(err))
      );
  });
});

//          -----------------------------------------------    SIGN UP
local.post("/auth/signup", (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  let errors = [];
  let errs = do_check(req.body, "register");
  if (errs.error) {
    // console.log("if-errors");
    errors = errs.error.details.map((err) => {
      return err.message;
    });
    res.render("authPage", {
      errors,
      name,
      email,
      password,
      loggedin: false,
    });
  } else {
    console.log("if-no errors   " + email);
    userModel
      .findOne({ email: email })
      .then((data) => {
        if (data) {
          errors.push("Email alraedy registered");
          res.render("authPage", {
            errors,
            name,
            email,
            password,
            loggedin: false,
          });
        } else {
          const user = new userModel({
            name,
            email,
            password,
          });
          user
            .save()
            .then((savedUser) => {
              let validationToken = crypto
                .createHash("sha256")
                .update(savedUser.email)
                .digest("hex");

              str = get_calculatedTime();
              let newToken = new tokenModel({
                userId: savedUser._id,
                token: validationToken,
                expires: str,
              });
              newToken
                .save()
                .then((savedToken) => {
                  console.log("tkn:  " + savedToken.token);
                  const message = `${process.env.BASE_URL}/verify/${savedUser.id}/${savedToken.token}`;
                  sendEmail(savedUser.email, "Verify Email", message)
                    .then((emailResult) =>
                      res.render("plzVerify", {
                        email: savedUser.email,
                        loggedin: false,
                      })
                    )
                    .catch((err) =>
                      console.log("error sending verification email")
                    );
                })
                .catch((err) => console.log("error saving new token in db"));
            })
            .catch((err) => {
              res.send("error saving new user");
            });
        }
      })
      .catch((err) => {
        console.log("::in catch -> err::  " + JSON.stringify(err));

        res.send(err);
      });
    console.log("::nothing ::  ");
  }
});

module.exports = local;
