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

/* 
Endpoint:
	GET  /adminorder/

Purpose:
  Gets a list of all orders made by all the users.

Credentials accepted: Admin only

Request Params: Empty

Request Body: Empty

Response:
  A JSON array of order objects.

Example axios request:
const result = await axios({
  method: 'get',
  url: '/adminorder/',
  withCredentials: true,
});

 */

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

/* 
Endpoint:
	PUT  /adminorder/:id
  Where ":id" is the Object Id of the order document
Purpose:
  To update the status, and the estimated delivery time of the order according to the admin's choice. Admin can
  update the order to any status other than "USER_CANCELLED".

Credentials accepted: Admin only

Request Body:
  status: The status to be set for the order
    type: String
  est_delivery_time: The estimated delivery time for the order to get delivered.
    type: Date

Response:
  The modified order object in JSON format.

Example axios request:
const result = await axios({
  method: 'put',
  url: '/order/'+order_id,
  withCredentials: true,
  data:{
    status:"OUT_FOR_DELIVERY",
    est_delivery_time: new Date(2020, 11, 22, 11, 30);
  }
});

 */

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
