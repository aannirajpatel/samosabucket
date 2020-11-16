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

const stripe = require("stripe")(process.env.STRIPE_SK);
const { v4: uuid } = require("uuid");

/* 
Endpoint:
	POST  /order/

Purpose:
  Validates and processes an order and adds it to the MongoDB data store.

Credentials accepted: Basic user, Admin

Request Params: Empty

Request Body: A JSON object, with the following keys -
  order: A JSON object, which contains all the details about the order
    type: JSON object
    keys:
      cart: A JSON array with elements denoting individual order items and their quantities purchased.
            Hence elements are of the format {itemId, qty, price}, each key with its obvious meaning.
      amount: The payment amount, in USD.
        type: Number
      address: A JSON object denoting the delivery address for the current order
        type: JSON object
        keys:
          line1: Address line 1
            type: String
          line2: Address line 2
            type: String
          city: Address city
            type: String
          state: Address state
            type: String
          zip: Address ZIP code
            type: String
    REQUIRED

  token: A JSON object, which is the payment token generated after processing payment on the front-end.
    type: JSON Object
    keys (only listing used keys):
      id: Stripe Payment token ID generated from the payment
      email: E-mail the user wants to use for processing the payment, not necessarily SamosaBucket registered email
      card: A JSON object representing credit/debit card payment data
        type: JSON object
        keys (only listing used keys):
          name: Name of the user as on their credit/debit card
          id: card payment id (same as the token id except two prefix characters that differ)
    REQUIRED

  deliveryTime: User-requested delivery time
    type: Date
    REQUIRED


Response:
  Responds with status 200 and a JSON object, {message: "Order created."}, if everything goes well.
  Responds with status 402 and a JSON object, {message: "Payment was not completed. Please contact us if money was sent."}, if everything does not go well

Example axios request:
const result = await axios({
  method: 'post',
  url: '/order/',
  withCredentials: true,
  data:{
    token,
    order,
    deliveryTime
  }
});

 */

router.post("/", auth, async (req, res) => {
  //pass on a token from frontend - email, prod info, charge/price of product
  const { order, token, deliveryTime } = req.body;
  const { cart, amount, address } = order;

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
          "Payment was not completed. Please contact us if money was sent.",
      });
    });
});

/* 
Endpoint:
	GET  /order/

Purpose:
  Gets a list of all orders made by the current user.

Credentials accepted: Basic user, Admin

Request Params: Empty

Request Body: Empty

Response:
  A JSON array of order objects.

Example axios request:
const result = await axios({
  method: 'get',
  url: '/order/',
  withCredentials: true,
});

 */

router.get("/", auth, async (req, res) => {
  try {
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

/* 
Endpoint:
	PUT  /order/:id
  Where ":id" is the Object Id of the order document
Purpose:
  Updates the status of the order according to the user's choice. As of now, restricted to only
  updating to "USER_CANCELLED".

Credentials accepted: Basic user, Admin

Request Body:
  status: The status to be set for the order
    type: String
    REQUIRED

Response:
  The modified order object in JSON format.

Example axios request:
const result = await axios({
  method: 'put',
  url: '/order/'+order_id,
  withCredentials: true,
  data:{
    status:"USER_CANCELLED"
  }
});

 */

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
