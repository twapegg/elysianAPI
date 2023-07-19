const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Get all users
router.get("/", auth.verifyToken, userController.getAllUsers);

// Check user details
router.get("/me", auth.verifyToken, userController.checkUserDetails);

// Check if email is already registered
router.post("/checkEmail", userController.checkUserEmail);

// Register user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Set user as admin
router.patch("/setAdmin", auth.verifyToken, userController.setAdmin);

// Unset user as admin
router.patch("/unsetAdmin", auth.verifyToken, userController.unsetAdmin);

// Retrieve authenticated user's current cart
router.get("/me/cart", auth.verifyToken, userController.getUserCart);

// Retrieve authenticated user's order history
router.get("/me/orders", auth.verifyToken, userController.getUserOrders);

// Update user password
router.patch(
  "/me/password",
  auth.verifyToken,
  userController.updateUserPassword
);

// Delete user (admin only)
router.delete("/:id", auth.verifyToken, userController.deleteUser);

// Count number of users
router.get("/count/total", userController.countUsers);

module.exports = router;
