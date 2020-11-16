const mongoose = require("mongoose");
const CartItem = require("./CartItem").model("cartitem").schema;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    zip: String,
    state: String,
    country: String,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: [CartItem],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", UserSchema);
