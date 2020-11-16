const mongoose = require("mongoose");
const ItemSchema = mongoose.Schema({
  imageUrl: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Delicious!",
  },
  available: {
    type: String,
    default: "true",
  },
  price: {
    type: Number,
    default: 0.01,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("item", ItemSchema);
