const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Get all carts
module.exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({ success: true, carts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get cart by id
module.exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create cart
module.exports.createCart = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);
    const newCart = new Cart({
      user: user.id,
    });
    await newCart.save();
    res.status(200).json({ success: true, cart: newCart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add product to cart
module.exports.addProductToCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (product.available === false) {
      return res
        .status(404)
        .json({ success: false, message: "Product not available" });
    }

    // Check if product is already in cart, if yes, update quantity
    const productInCart = cart.products.find(
      (product) => product.product.toString() === req.body.product
    );

    if (productInCart) {
      productInCart.quantity += req.body.quantity;
      cart.subTotal += product.price * req.body.quantity;
      await cart.save();
      return res.status(200).json({ success: true, cart });
    }

    // Add product to cart
    cart.products.push({
      product: product.id,
      quantity: req.body.quantity,
    });
    // Calculate total price
    cart.subTotal += product.price * req.body.quantity;
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.updateProductQuantityInCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    // Find the product inside the cart
    const productFromCart = cart.products.find(
      (product) => product.product.toString() === req.body.product
    );

    if (!productFromCart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the product
    productFromCart.quantity = req.body.quantity;

    // Save the updated cart
    await cart.save();

    res.send(cart.products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from cart
module.exports.removeProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    const productFromCart = cart.products.find(
      (product) => product.product.toString() === req.body.product
    );

    const product = await Product.findById(req.body.product);

    // Recalculate price
    cart.subTotal -= product.price * productFromCart.quantity;

    // Remove product from cart
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== req.body.product
    );

    // Calculate total price
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update cart
module.exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    cart.items = req.body.items;
    cart.subTotal = req.body.subTotal;
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete cart
module.exports.deleteCart = async (req, res) => {
  try {
    return Cart.findByIdAndDelete(req.params.id).then((result) => {
      res.status(200).json({ success: true, message: "Cart deleted" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create an order
module.exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      subTotal: cart.subTotal,
    });
    cart.items = [];
    cart.subTotal = 0;
    await cart.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
