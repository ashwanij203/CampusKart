const Product = require("../models/Product");

// ================= ADD PRODUCT =================

exports.addProduct = async (req, res) => {
  try {
    const images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(file.path);
      });
    }

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      condition: req.body.condition,
      location: req.body.location,
      images,
      seller: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL PRODUCTS =================

exports.getProducts = async (req, res) => {
  try {
    const { search, category, condition, minPrice, maxPrice, location, sort } = req.query;

    // Build query
    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by condition
    if (condition && condition !== "All") {
      query.condition = condition;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("seller", "name email phone")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE PRODUCT =================

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE PRODUCT =================

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE PRODUCT =================

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MY PRODUCTS =================

exports.myProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CATEGORY COUNTS =================

exports.getCategoryCounts = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    // Build a map: { Books: 12, Electronics: 5, ... }
    const countsMap = {};
    counts.forEach((c) => {
      if (c.category) countsMap[c.category] = c.count;
    });

    res.status(200).json({ success: true, counts: countsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};