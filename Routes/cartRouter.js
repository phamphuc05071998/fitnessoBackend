const express = require("express");
const cartController = require("./../Controllers/cartController");
const authController = require("./../Controllers/authController");
const router = express.Router();
router.use(authController.isProtect);
router
  .route("/items")
  .post(cartController.addToCart)
  .get(cartController.getCartUser);
router.route("/items/:itemId").delete(cartController.removeCartItem);

module.exports = router;
