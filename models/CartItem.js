const mongoose = require("mongoose");

const CartItem = mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  qty: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    default: 0.01,
  },
  dip: {
    type: String,
    default: "Tamarind Sauce",
  },
  spicy: {
    type: Boolean,
    default: false,
  },
  vegetarian: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("cartitem", CartItem);
