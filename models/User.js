const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    //select is a property that whenever we query
    // for a user do we want to return the password as well ?
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash the password before sending it
// Add a bit of middleware, before saving, execute async function
// Next is argument necessary if the pwd hasn't been change
// Need PAckage Bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // 10 is level of security, the higher the more secure
  const salt = await bcrypt.genSalt(10);

  // Here the this is "User"
  // Set the password feild equal to hash version of the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Mongoose allow to create methods
// function key word important
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// The sign method gets a payload, a secret and an object that wrap the options
// The User model can use process.env variables because we use this model in auth.js
// which below in the initiation of the package
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
