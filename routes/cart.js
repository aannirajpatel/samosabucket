const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

router.use(cookieParser());

router.post("/", auth, async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const qty = req.body.qty;
    if (itemId === null || qty === null) {
      throw { message: "Error adding to cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { itemId: itemId } } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    const item = await Item.findById(itemId);
    if (item === undefined) {
      throw { message: "Item ID not found in the store" };
    }
    user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price }];
    //console.log(user.cart);
    await user.save();
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error removing from cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { itemId: itemId } } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    //console.log(user.cart);
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error removing from cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $set: { cart: [] } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    //console.log(user.cart);
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
