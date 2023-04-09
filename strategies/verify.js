const express = require("express");
const verifyRoutes = express.Router();
const { tokenModel, userModel } = require("../models/UserModel");
//

verifyRoutes.get("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  // console.log(id + "    :: extracted ::  " + token);
  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(400).send("Invalid link");

    const tokenData = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });

    console.log("token id : ---------- " + tokenID);
    console.log("exp:  " + token.expires);
    if (tokenData) {
      if (tokenValid(tokenData.expires.split(".")) == true) {
        if (user.verified == true) {
          res.render("verificationMessage", {
            msg: "Already verified.",
            loggedin: true,
          });
        } else {
          console.log("token valid--- user to be verified");
          userModel.findByIdAndUpdate(
            user._id,
            { verified: true },
            function (err, updatedUser) {
              if (updatedUser) {
                tokenModel.findByIdAndRemove(
                  tokenData._id,
                  function (err, deletedToken) {
                    if (deletedToken) {
                      console.log("Removed token : ", deletedToken);
                      res.render("authPage", {
                        msg: "Email verified: you may login now.",
                        loggedin: false,
                      });
                    }
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
      } else {
        res.render("verificationMessage", {
          msg: "Verification link expired .",
          loggedin: false,
        });
      }
    } else {
      return res.status(400).send("Invalid link");
    }
  } catch (error) {
    res.status(400).send("An error occured ");
  }
});

const tokenValid = (timeMark) => {
  console.log("tm:  " + timeMark);
  let d = new Date();
  d.setDate(timeMark[0]);
  d.setMonth(timeMark[1]);
  d.setYear(timeMark[2]);
  d.setHours(timeMark[3]);
  d.setMinutes(timeMark[4]);
  if (new Date().getTime() > d.getTime()) {
    console.log("verification link expired");
    return false;
  } else {
    console.log("token valid -- found ");
    return true;
  }
};
function get_calculatedTime() {
  let d = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
  return (
    d.getDate() +
    "." +
    d.getMonth() +
    "." +
    d.getFullYear() +
    "." +
    d.getHours() +
    "." +
    d.getMinutes()
  );
}

module.exports = { verifyRoutes, get_calculatedTime, tokenValid };
