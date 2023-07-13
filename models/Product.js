const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Clothes", "Shoes", "Accessories"],
  },
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  description: String,
  rating: Number,
  numReviews: Number,
  available: Boolean,
  brand: String,
});

module.exports = mongoose.model("Product", productSchema);
