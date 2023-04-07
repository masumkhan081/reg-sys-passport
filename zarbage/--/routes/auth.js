const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//
const User = require("../model/User");
const { loginValidation } = require("../validation");
const { registerValidation } = require("../validation");
const router1 = express.Router();
//

router1.post("/register", async (req, res) => {
  //
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // hash password
  const salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  // would be nullif there exist a user with this email
  const emailExist = await User.findOne({ email: req.body.email }).exec();
  // console.log(">>>>>>  " + emailExist);
  if (emailExist) return res.status(400).send("Email alraedy exist");

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
    console.log("saved data");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

//
router1.post("/login", async (req, res) => {
  //
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // hash password
  const salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  // would be nullif there exist a user with this email
  const user = await User.findOne({ email: req.body.email }).exec();
  // console.log(">>>>>>  " + emailExist);
  if (!user) return res.status(400).send("Email not found");

  const passvalidity = bcrypt.compareSync(req.body.password, user.password);
  console.log("!!!! " + passvalidity);
  if (!passvalidity) return res.status(400).send(" password is wrong");
  res.send("logged in");
  //

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
  res.header("auth-token", token).send(token);
});

module.exports = router1;
