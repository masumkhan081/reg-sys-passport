const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 4,
    max: 100,
    required: true,
  },
  email: {
    type: String,
    min: 25,
    max: 200,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
