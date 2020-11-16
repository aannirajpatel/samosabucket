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
});

module.exports = mongoose.model("cartitem", CartItem);
