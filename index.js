const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejsLayout = require("express-ejs-layouts");
const { verifyRoutes } = require("./strategies/verify");
// env
dotenv.config();
const port = process.env.PORT;
const mngdbUri = process.env.URI;
//server
const app = express();
//      --------------------------------using Router instance as route handlers, view engine
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(ejsLayout);

//     secret: "terimaki",
//     cookie: { maxAge: 1000 * 60 * 60 * 60 },

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//
app.use("", require("./strategies/basic"));
app.use("", require("./strategies/local"));
app.use("", require("./strategies/google"));
app.use("", require("./strategies/linkedin"));
app.use("", require("./strategies/facebook"));
app.use("", require("./strategies/github"));
app.use("/auth/verify", verifyRoutes);

//connection: data tier: mongodb
mongoose.connect(mngdbUri, { useNewUrlParser: true }, (err, connected) => {
  if (connected) {
    console.log("guess what just happened ? connected ! ha ha");
  } else {
    console.log("error in connection");
  }
});
//      --------------------------------server on what port ?
app.listen(port, () => {
  console.log(`Port: ${port}`);
});
