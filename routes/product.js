const router = require("express").Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

// Get all products
router.get("/all", productController.getAllProducts);

// Get all available products
router.get("/", productController.getAvailableProducts);

// Get all products with similar names
router.get("/similar/:name", productController.getSimilarProducts);

// Get product by id
router.get("/:id", productController.getProductById);

// Create a product (admin only)
router.post("/", auth.verifyToken, productController.createProduct);

// Update a product (admin only)
router.put("/:id", auth.verifyToken, productController.updateProduct);

// Archive a product (admin only)
router.patch(
  "/archive/:id",
  auth.verifyToken,
  productController.archiveProduct
);

// Activate a product (admin only)
router.patch(
  "/activate/:id",
  auth.verifyToken,
  productController.activateProduct
);

// Delete a product (admin only)
router.delete("/:id", auth.verifyToken, productController.deleteProduct);

// Count total products
router.get("/count/total", productController.countProducts);

module.exports = router;
