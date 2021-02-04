const User = require("../models/User");

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
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Asynchrone fonction because working with the database;
// Imply using a try {} catch {} bloque, as it's asynchronous
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 400 for bad request
  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    // 404 for User not found
    if (!user) {
      res.status(404).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      res.status(404).json({ success: false, error: "Invalid Credentials" });
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
