const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  updateProfile,
} = require("../controllers/auth.controller");

const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", verifyToken, profile);

router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);

module.exports = router;
