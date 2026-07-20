const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("CampusKart API Running...");
});

module.exports = app;
