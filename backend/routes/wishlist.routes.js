const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  addToWishlist,
  getWishlist,
  removeWishlist,
} = require("../controllers/wishlist.controller");

router.post("/", verifyToken, addToWishlist);

router.get("/", verifyToken, getWishlist);

router.delete("/:productId", verifyToken, removeWishlist);

module.exports = router;