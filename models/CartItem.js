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
  dip: { //samosabucket - momo dumplings
    type: String,
  },
  spicy: { //samosabucket - momo dumplings
    type: Boolean,
  },
  vegetarian: { //samosabucket - momo dumplings
    type: Boolean,
    // default: false,
  },
  item_name: {
    type: String,
  },
});

module.exports = mongoose.model("cartitem", CartItem);
