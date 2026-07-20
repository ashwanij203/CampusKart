const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:productId", verifyToken, updateCartItem);
router.delete("/clear", verifyToken, clearCart);
router.delete("/:productId", verifyToken, removeFromCart);

module.exports = router;
