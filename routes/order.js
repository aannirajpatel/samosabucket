const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const authAdmin = require("../middleware/authAdmin");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const moment = require("moment");
require("dotenv").config();
router.use(cookieParser());

//TODO: Add a stripe key
const stripe = require("stripe")(process.env.STRIPE_SK);
const { v4: uuid } = require("uuid");

//middleware

router.post("/", auth, async (req, res) => {
  //pass on a token from frontend - email, prod info, charge/price of product
  const { order, token, deliveryTime } = req.body;
  const { cart, amount, address } = order;
  /* console.log("ORDER", order);
  console.log("DEL_TIME", deliveryTime);
  console.log("PAID", amount);
  console.log("TOKEN", token); */
  const idempotencyKey = uuid();
  return stripe.customers
    .create({ email: token.email, source: token.id })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: amount * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: "Samosabucket Purchase",
          shipping: {
            name: token.card.name,
            address: {
              city: address.city,
              line1: address.line1,
              line2: address.line2,
              postal_code: address.zip,
              country: "US",
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then(async (result) => {
      const order = new Order({
        userId: mongoose.Types.ObjectId(req.user.id),
        stripePayID: token.card.id,
        status: "PAID",
        cart: cart,
        amount: amount,
        delivery_address: address,
        delivery_time: deliveryTime,
        est_delivery_time: moment(deliveryTime).clone().add(30, "minutes"),
      });
      await order.save();
      res.status(200).json({ message: "Order created." });
    })
    .catch((err) => {
      console.log(err);
      res.status(402).json({
        message:
          "Payment was not completed. Please contact us if money was sent." +
          err,
      });
    });
});

router.get("/", auth, async (req, res) => {
  try {
    /*     console.log(req.user.id); */
    const orders = await Order.find({
      userId: mongoose.Types.ObjectId(req.user.id),
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: JSON.stringify(err) });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (req.body.status !== "USER_CANCELLED")
      throw {
        message:
          "Non-admin user can only cancel their order, that too, only if it is not currently being delivered.",
      };
    const currentOrder = await Order.findById(req.params.id);
    if (currentOrder.status !== "PAID" && currentOrder.status !== "PREPARING")
      throw { message: "Can only change order while PAID or PREPARING" };
    const order = await Order.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        userId: mongoose.Types.ObjectId(req.user.id),
      },
      { ...req.body },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: JSON.stringify(err) });
  }
});

module.exports = router;
