const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Cart = require("./../Models/cartModel");
const handlerFactory = require("./../Controllers/handlerFactory");
const GymCourse = require("./../Models/gymCourseModel");
exports.getCartUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId)
    next(new AppError("User don't exist. Please login and try again", 401));
  const cart = await Cart.findOne({ userId: userId }).populate(
    "items.courseId"
  );
  if (!cart) return next(new AppError("Can't find cart of this user", 400));
  res.status(200).json({
    message: "Success",
    cart,
  });
});

exports.getAllCart = handlerFactory.getAll(Cart);
exports.addItemToCart = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;
  try {
    const gymCourse = await GymCourse.findById(courseId);
    if (!gymCourse) {
      return res.status(404).json({ message: "GymCourse not found" });
    }

    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId: userId, items: [], totalPrice: 0 });
    }
    // Find the GymCourse to get the price
    const existingCartItem = cart.items.find((item) => {
      return item.equals(gymCourse._id);
    });
    if (existingCartItem) {
      return res
        .status(409)
        .json({ message: "GymCourse already exists in cart" });
    }
    cart.items.push(gymCourse._id);
    cart.totalPrice += gymCourse.price;
    cart.createdAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const gymCourseId = req.body.courseId;

  try {
    let cart = await Cart.findOne({ userId: userId }).populate(
      "items.courseId"
    );
    const gymCourse = await GymCourse.findById(gymCourseId);
    if (!gymCourse) {
      res.status(500).json({
        message: "Invalid request",
      });
    }
    if (cart) {
      const indexFound = cart.items.findIndex(
        (item) => item.courseId._id == gymCourseId
      );
      if (indexFound !== -1) {
        res.status(500).json({
          message: "All ready have this items in carts",
        });
      } else {
        const cartItem = {
          courseId: gymCourseId,
        };
        cart.items.push(cartItem);
        cart.totalPrice += Math.round(gymCourse.price * 100) / 100;
        const data = await cart.save();
        res.status(201).json({
          cart: data,
        });
      }
    } else {
      const cartData = {
        userId: userId,
        items: [
          {
            courseId: gymCourseId,
          },
        ],
        totalPrice: gymCourse.price,
      };
      const cartItem = await Cart.create(cartData);
      res.status(201).json({
        cart: cartItem,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Something Went Wrong",
      err: err,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find((item) => item.courseId.equals(itemId));

    if (!cartItem) {
      return res.status(404).json({ message: "CartItem not found" });
    }
    const gymCourseId = cartItem.courseId;
    const gymCourse = await GymCourse.findById(gymCourseId);
    cart.totalPrice -= Math.round(gymCourse.price * 100) / 100;
    cart.items = cart.items.filter((item) => !item.courseId.equals(itemId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
