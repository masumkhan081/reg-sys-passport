const express = require("express");
const basicRoutes = express.Router();
const dotenv = require("dotenv");
dotenv.config();
//

basicRoutes.get("/", (req, res) => {
  console.log(typeof req.user + "  here ...", JSON.stringify(req.user));

  if (req.user == undefined) {
    res.render("landing", {
      loggedin: false,
      user: "null",
      data: "null",
    });
  } else if (req.user == "null") {
    console.log("req.user : -- found    -- " + JSON.stringify(req.user));

    let data = getAccountData(req.user);
    console.log("data: --- " + JSON.stringify(data));
    res.render("landing", {
      loggedin: true,
      user: req.user,
      data,
    });
  } else if (req.user == "not-verified") {
    res.redirect("/auth/verification");
  }
});
basicRoutes.get("/auth/verification", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("sendVerification", {
      loggedin: false,
      msg: "Account found but not verified. ",
      email: "",
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
    res.render("authPage", { loggedin: true, user: req.user });
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
    res.render("signupPage", { loggedin: true, user: req.user });
    // res.redirect("/")
  }
});
basicRoutes.get("/auth/signin", (req, res) => {
  if (
    req.user == undefined ||
    req.user.status == "null" ||
    req.user.status == "not-verified"
  ) {
    res.render("signinPage", { loggedin: true, user: req.user });
  } else {
    res.render("signinPage", { loggedin: true, user: req.user });
    // res.redirect("/");
  }
});
basicRoutes.get("/signout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      res.send("error loging out !");
    }
    res.redirect("/");
  });
});

function getAccountData(obj) {
  // console.log("obj::::::       " + JSON.stringify(obj));
  let resultObj = {};
  let extra = {};
  if (obj.provider == "linkedin") {
    console.log(">>>>>    !!!");
    resultObj.id = obj["id"];
    resultObj.name = obj["displayName"];
    resultObj.email = obj["emails"][0].value;
    resultObj.photo = obj["photos"][0].value;
    resultObj.provider = obj["provider"];
    //
    resultObj.extra = extra;
    return resultObj;
  }
  if (obj.provider == "google") {
    resultObj.name = obj["displayName"];
    resultObj.email = obj["emails"][0].value;
    resultObj.photo = obj["photos"][0].value;
    resultObj.provider = obj["provider"];
    //
    resultObj.extra = extra;
    return resultObj;
  }
  if (obj.provider == "facebook") {
    resultObj.name = obj.name.givenName + " " + obj.name.familyName;
    resultObj.email = obj["emails"][0].value;
    // resultObj.photo = obj["photos"][0].value;
    resultObj.provider = obj["provider"];
    //
    resultObj.extra = extra;
    return resultObj;
  }
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
