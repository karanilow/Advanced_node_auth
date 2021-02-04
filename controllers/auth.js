const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Asynchrone fonction because working with the database;
// Imply using a try {} catch {} bloque, as it's asynchronous
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // 1. create() is a thin wrapper around save()
    //    equivalent to new User({..}) User.save()

    // 2. "await" wait for a promise - only possible in an asychronous fonction
    const user = await User.create({
      username,
      email,
      password,
    });

    // Possible to return user only (no value) thanks to JSX
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Asynchrone fonction because working with the database;
// Imply using a try {} catch {} bloque, as it's asynchronous
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 400 for bad request
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    // 404 for User not found
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    res.status(200).json({
      success: true,
      token: "ezffsf",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.forgotpassword = (req, res, next) => {
  res.send("Forgot Password Route");
};

exports.resetpassword = (req, res, next) => {
  res.send("Reset Password Route");
};
