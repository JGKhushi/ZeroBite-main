// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  // 🔹 DEFAULT ERROR
  let error = { ...err };
  error.message = err.message;

  // 🔹 LOG ERROR FOR DEVELOPERS
  console.log("Error Stack:", err.stack);

  // 🔹 MONGOOSE BAD OBJECT ID
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // 🔹 MONGOOSE DUPLICATE KEY
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // 🔹 MONGOOSE VALIDATION ERROR
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message: message.join(", "), statusCode: 400 };
  }

  // 🔹 JWT ERROR
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  // 🔹 JWT EXPIRED ERROR
  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  // 🔹 PRISMA ERRORS
  if (err.code) {
    switch (err.code) {
      case "P2002":
        error = { message: "Unique constraint failed", statusCode: 400 };
        break;
      case "P2025":
        error = { message: "Record not found", statusCode: 404 };
        break;
      case "P2003":
        error = { message: "Foreign key constraint failed", statusCode: 400 };
        break;
      default:
        error = { message: "Database error", statusCode: 500 };
    }
  }

  // 🔹 FINAL RESPONSE
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
