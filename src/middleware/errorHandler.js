module.exports = (err, req, res, next) => {
  console.error(err); // for debugging

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
  }

  // Joi validation error
  if (err.isJoi) {
    statusCode = 400;
    message = err.details[0].message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
