const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const admin = auth.decode(req.headers.authorization);

    if (!admin.isAdmin) {
      return res.status(401).send("Unauthorized");
    }

    return await User.find().then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Check user details
module.exports.checkUserDetails = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);

    return User.findById(user.id)
      .select("-password")
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Check if email is already registered
module.exports.checkUserEmail = async (req, res) => {
  try {
    return User.find({
      email: req.body.email,
    }).then((result) => {
      res.send(result.length > 0 ? true : false);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Register a User
module.exports.registerUser = async (req, res) => {
  try {
    return User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin,
    }).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Login a User
module.exports.loginUser = async (req, res) => {
  try {
    // Check if user exists
    if (
      await User.findOne({ email: req.body.email }).then((result) => {
        if (result) {
          const password = bcrypt.compareSync(
            req.body.password,
            result.password
          );
          return password
            ? res.status(200).send({ access: auth.createToken(result) })
            : res.status(401).send("Incorrect password");
        }
        return res.status(404).send("User not found");
      })
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Set user as admin
module.exports.setAdmin = async (req, res) => {
  try {
    const admin = auth.decode(req.headers.authorization);

    if (!admin.isAdmin) {
      return res.status(401).send("Unauthorized. Must be an admin");
    }

    return User.findByIdAndUpdate(
      req.body.id,
      { isAdmin: true },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Unset user as admin
module.exports.unsetAdmin = async (req, res) => {
  try {
    const admin = auth.decode(req.headers.authorization);

    if (!admin.isAdmin) {
      return res.status(401).send("Unauthorized. Must be an admin");
    }

    return User.findByIdAndUpdate(
      req.body.id,

      { isAdmin: false },
      { new: true }
    ).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Retrieve authenticated user's current cart
module.exports.getUserCart = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);
    const cart = await Cart.findOne({ user: user.id });
    if (!cart) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Retrieve authenticated user's orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);
    const orders = await Order.find({ user: user.id });
    return res.status(200).send(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update user password
module.exports.updateUserPassword = async (req, res) => {
  try {
    const user = auth.decode(req.headers.authorization);

    return User.findById(user.id).then((result) => {
      if (result) {
        const password = bcrypt.compareSync(req.body.password, result.password);
        if (password) {
          return User.findByIdAndUpdate(
            user.id,
            { password: bcrypt.hashSync(req.body.newPassword, 10) },
            { new: true }
          ).then((result) => {
            res.status(200).send(result);
          });
        }
        return res.status(401).send("Incorrect password");
      }
      return res.status(404).send("User not found");
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete a user
module.exports.deleteUser = async (req, res) => {
  try {
    const admin = auth.decode(req.headers.authorization);

    if (!admin.isAdmin) {
      return res.status(401).send("Unauthorized. Must be an admin");
    }

    return User.findByIdAndDelete(req.params.id).then((result) => {
      res.status(200).send("User deleted");
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Count number of users
module.exports.countUsers = async (req, res) => {
  try {
    return User.countDocuments().then((result) => {
      res.status(200).send(result.toString());
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
