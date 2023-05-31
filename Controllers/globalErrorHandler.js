const dotenv = require("dotenv").config();

module.exports = (err, req, res, next) => {
  console.log(err);
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "production") {
    if (err.isOperator) {
      res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
      });
    } else {
      res.status(400).json({
        message: "Some thing went wong please try again later",
      });
    }
  }
  next();
};
