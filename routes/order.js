const router = require("express").Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

// Get all orders
router.get("/", auth.verifyToken, orderController.getAllOrders);

// Get order by id
router.get("/:id", auth.verifyToken, orderController.getOrderById);

// Get orders by user id
router.get("/user/:id", auth.verifyToken, orderController.getOrdersByUserId);

// Create order
router.post("/", auth.verifyToken, orderController.createOrder);

// Delete order
router.delete("/:id", auth.verifyToken, orderController.deleteOrder);

// Calculate total sales of all orders
router.get("/get/totalsales", auth.verifyToken, orderController.getTotalSales);

// Get total number of orders
router.get(
  "/get/count",
  auth.verifyToken,
  orderController.getTotalNumberOfOrders
);

module.exports = router;
