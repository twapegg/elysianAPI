const router = require("express").Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Get all carts
router.get("/", cartController.getAllCarts);

// Get cart by id
router.get("/:id", cartController.getCartById);

// Create cart
router.post("/", auth.verifyToken, cartController.createCart);

// Add product to cart
router.patch("/add/:id", auth.verifyToken, cartController.addProductToCart);

// // Update cart
// router.patch("/:id", auth.verifyToken, cartController.updateCart);

// Update product quantity in cart
router.patch(
  "/:id/updateProductQuantity",
  auth.verifyToken,
  cartController.updateProductQuantityInCart
);

// // Clear cart
// router.patch("/:id/clear", auth.verifyToken, cartController.clearCart);

// // Checkout cart
// router.patch("/:id/checkout", auth.verifyToken, cartController.createOrder);

// Remove product from cart
router.delete("/:id", auth.verifyToken, cartController.removeProductFromCart);

// Delete cart
router.delete("/delete/:id", auth.verifyToken, cartController.deleteCart);

module.exports = router;
