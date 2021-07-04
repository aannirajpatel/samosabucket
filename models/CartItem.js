const mongoose = require("mongoose");

const CartItem = mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  qty: {
    type: Number,
  },
  price: {
    type: Number,
  },
  dip: {
    type: String,
  },
  meat: {
    type: String,
  },
  spicy: {
    type: Boolean,
  },
  vegetarian: {
    type: Boolean,
    // default: false,
  },
  item_name: {
    type: String,
  },
});

module.exports = mongoose.model("cartitem", CartItem);
