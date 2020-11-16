const mongoose = require("mongoose");
const CartItem = require("./CartItem").model("cartitem").schema;
const OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  stripePayID: {
    type: String,
    required: true,
  },
  status: {
    type: String, //PAID, PREPARING, ADMIN_CANCELLED, USER_CANCELLED, OUT_FOR_DELIVERY, DELIVERED
    default: true,
    pattern:
      "(PAID)|(PREPARING)|(ADMIN_CANCELLED)|(USER_CANCELLED)|(OUT_FOR_DELIVERY)|(DELIVERED)",
  },
  delivery_address: {
    line1: String,
    line2: String,
    city: String,
    zip: String,
    state: String,
    country: String,
  },
  delivery_time: {
    type: Date,
    default: Date.now(),
  },
  est_delivery_time: {
    type: Date,
    default: Date.now(),
  },
  cart: [CartItem],
  amount: {
    type: Number,
    default: 0.01,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("order", OrderSchema);
