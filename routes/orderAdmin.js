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
const cookieParser = require("cookie-parser");
require("dotenv").config();
router.use(cookieParser());

router.get("/", authAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({
      est_delivery_time: 1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: JSON.stringify(err) });
  }
});

router.put("/:id", authAdmin, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: JSON.stringify(err) });
  }
});

module.exports = router;
