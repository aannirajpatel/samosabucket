const mongoose = require("mongoose");
const { stringify } = require("uuid");

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
  side: { //Samosabucket - chicken tikka
    type: String,
  },
  mainItem: { //vegan flava cafe
    type: String,
  },
  tacoShell: { //vegan flava cafe
    type: String,
  },
  item_name: {
    type: String,
  },
  delivery_time: {
    type: String,
    default: "Saturday",
  },
});

module.exports = mongoose.model("cartitem", CartItem);
