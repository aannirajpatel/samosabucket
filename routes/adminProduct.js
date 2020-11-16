const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const Order = require("../models/Order");
const authAdmin = require("../middleware/authAdmin");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const e = require("express");
require("dotenv").config();
router.use(cookieParser());

router.get("/", authAdmin, async (req, res) => {
  try {
    const orders = await Item.find({}).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/list", authAdmin, async (req, res) => {
  try {
    const itemIds = req.body.map((x) => mongoose.Types.ObjectId(x));
    const items = await Item.find({ _id: { $in: itemIds } });
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/", authAdmin, async (req, res) => {
  try {
    const itemData = req.body;
    if (itemData === undefined) {
      throw { message: "Error adding to store" };
    }
    const item = new Item(itemData);
    await item.save();
    res.status(200).json(item);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.put("/:id", authAdmin, async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
