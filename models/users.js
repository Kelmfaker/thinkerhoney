const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: String,
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  address: {
    city: String,
    region: String,
    details: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;