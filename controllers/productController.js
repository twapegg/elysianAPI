const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Get all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all available products
module.exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.find({ available: true });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all products with similar name
module.exports.getSimilarProducts = async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get product by id
module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create a product (admin only)
module.exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a product (admin only)
module.exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Archive a product (admin only)
module.exports.archiveProduct = async (req, res) => {
  // try {
  const user = auth.decode(req.headers.authorization);

  if (!user.isAdmin) {
    return res.status(401).send("Unauthorized. Must be an admin");
  }

  const productId = req.params.id;

  // Check if product exists
  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    return res.status(404).send("Product not found");
  }

  // Update the specified property
  await Product.updateOne(
    { _id: productId },
    {
      available: false,
    }
  );
  // Fetch the updated product
  const updatedProduct = await Product.findById(productId);
  return res.send(updatedProduct);
  //   } catch (err) {
  //     return res.status(500).send(err);
  //   }
};

// Activate a product (admin only)
module.exports.activateProduct = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);

    if (!user.isAdmin) {
      return res.status(401).send("Unauthorized. Must be an admin");
    }

    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).send("Product not found");
    }

    // Update the specified property
    await Product.updateOne(
      { _id: productId },
      {
        available: true,
      }
    );
    // Fetch the updated product
    const updatedProduct = await Product.findById(productId);
    return res.send(updatedProduct);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Delete a product (admin only)
module.exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Count total products
module.exports.countProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
