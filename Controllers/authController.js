const User = require("./../Models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const promisify = require("util");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });
};
const respondWithToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  });
  res.status(statusCode).json({
    message: "Success",
    user,
    token,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    respondWithToken(newUser, 201, req, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 401));
  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError("User not exist", 404));

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return next(
      new AppError("Wrong email or password, please try again later", 401)
    );

  respondWithToken(user, 200, req, res);
});
exports.isProtect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not login please login to get access", 401)
    );
  //2) decode the token to find the user

  const decoded = jwt.verify(token, process.env.SECRET_JWT);
  console.log(decoded.id);
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError("The user belonging to this token is no longer exist", 401)
    );
  //3) check the password changed after the jwt
  if (user.isChangedPassword(decoded.iat))
    return next(
      new AppError("Password changed recently, Please login again", 401)
    );
  req.user = user;

  next();
});
