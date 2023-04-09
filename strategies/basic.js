const express = require("express");
const basicRoutes = express.Router();
const dotenv = require("dotenv");
dotenv.config();
//

basicRoutes.get("/", (req, res) => {
  //console.log(typeof req.user + "  here ...", JSON.stringify(req.user));
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("landing", {
      loggedin: false,
      data: "null",
    });
  } else if (req.user.status == "logged-in") {
    res.render("landing", {
      loggedin: true,
      data: req.user,
    });
  }
});
basicRoutes.get("/auth/verification", (req, res) => {
  if (req.user == undefined || req.user.status == "null") {
    res.render("authPage", { loggedin: false, user: null });
  }
  if (req.user.status == "not-verified") {
    res.render("sendVerification", {
      loggedin: false,
      msg: "Account found but not verified. ",
      email: req.user.email,
    });
  } else {
    res.redirect("/");
  }
});

basicRoutes.get("/auth", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("authPage", { loggedin: false, user: null });
  } else {
    res.redirect("/");
  }
});
basicRoutes.get("/auth/signup", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("signupPage", { loggedin: false, user: null });
  } else {
    res.redirect("/");
  }
});
basicRoutes.get("/auth/signin", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("signinPage", { loggedin: false, user: null });
  } else {
    res.redirect("/");
  }
});
basicRoutes.get("/signout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      res.send("error loging out !");
    }
    res.redirect("/auth");
  });
});

function getAccountData(obj) {
  let resultObj = {};
  let extra = {};

  if (obj.provider == "github") {
    resultObj.name = obj["displayName"];
    resultObj.email = obj["emails"][0].value;
    resultObj.photo = obj["photos"][0].value;
    resultObj.provider = obj["provider"];
    //
    extra.username = obj["username"];
    extra.profileUrl = obj["profileUrl"];
    extra.address = obj["_json"]["location"];
    extra.bio = obj["_json"]["bio"];
    extra.hireable = obj["_json"]["hireable"];
    console.log(">>>   Extra:      " + JSON.stringify(extra));
    //
    resultObj.extra = extra;
    return resultObj;
  }
}

module.exports = basicRoutes;
