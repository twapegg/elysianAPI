const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Get all orders
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get order by id
module.exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get orders by user id
module.exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create order
module.exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.body.user });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Calculate total price
    const totalPrice = cart.subTotal + cart.subTotal * 0.1;

    const order = await Order.create({
      user: req.body.user,
      products: cart.products,
      totalPrice: totalPrice,
    });

    // Clear cart
    cart.products = [];
    cart.subTotal = 0;
    await cart.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete order
module.exports.deleteOrder = async (req, res) => {
  try {
    return Order.findByIdAndDelete(req.params.id).then((order) => {
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      res.status(200).json({ success: true, message: "Order deleted" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Calculate total sales of all orders
module.exports.getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    res
      .status(200)
      .json({ success: true, totalSales: totalSales.pop().totalSales });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get total number of orders
module.exports.getTotalNumberOfOrders = async (req, res) => {
  try {
    const totalNumberOfOrders = await Order.countDocuments();
    res
      .status(200)
      .json({ success: true, totalNumberOfOrders: totalNumberOfOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
