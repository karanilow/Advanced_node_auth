const ErrorResponse = require("../utils/errorResponse");

// 1. err needs to be placed first, it's important
// 2. This middleware is called when an argument will be passed to next()
//    This is due to how Express works, when an argument is passed to next, Express
//    will abort the current stack and will run all the middleware that has 4 parameters.
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  // 11000 in Mongoose is duplicated key
  // 400 is a bad request
  if (err.code === 11000) {
    const message = `Duplicate Feild Value Enter`;
    error = new ErrorResponse(message, 400);
  }

  // Same thing, ValidationError are from Mongoose
  // It usually send an Object with nested Objects
  if (err.name === "ValidationError") {
    // Object.values Returns an array of values of the enumerable properties of an object
    // Then we map through that array and put it into message
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // 500 is a server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
  });
};

module.exports = errorHandler;
