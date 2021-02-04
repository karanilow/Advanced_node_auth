// Dotenv loads environment variables from a .env file into process.env
// Important to be at the top because all of what is below uses this process.env syntaxe
require("dotenv").config({ path: "./config.env" });

const express = require("express");

const connectDB = require("./config/db");

const errorHandler = require("./middleware/error");

// Connect DB

connectDB();

const app = express();

// Extract the body from the response
app.use(express.json());

// Redirect any request to the auth router
app.use("/api/auth", require("./routes/auth"));

// Error Handler (Should be last piece of middleware)
// This because the errors are called with the next() function.
// It won't catch any errors coming from middleware stacks after him
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Put the listen function in server to handle crashes nicely

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
