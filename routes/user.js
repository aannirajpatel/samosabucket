const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authAdmin = require("../middleware/authAdmin");
require("dotenv").config();

router.use(cookieParser());

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a valid password"),
    body("name").notEmpty().withMessage("Please enter your full name here"),
    body("phone")
      .isMobilePhone()
      .withMessage("Please enter valid mobile phone number"),
    body("address.line1")
      .notEmpty()
      .withMessage("Line 1 of address is mandatory"),
    body("address.city").notEmpty().withMessage("Please enter a valid city"),
    body("address.state").notEmpty().withMessage("Please enter a state"),
    body("address.zip")
      .notEmpty()
      .isLength({ min: 5, max: 5 })
      .withMessage("Please enter a valid postal/ZIP code"),
  ],
  async (req, res) => {
    const reqValidation = validationResult(req);
    if (!reqValidation.isEmpty()) {
      return res.status(400).json({ message: reqValidation.array() });
    }
    const { email, password, name, address, phone } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User({ email, password, name, address, phone });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: { id: user.id, isAdmin: user.isAdmin },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 86400 * 7 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res
            .status(200)
            .cookie("auth", token, { maxAge: 86400000 * 7, httpOnly: true })
            .send();
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).json({ message: "Error in saving" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({
        min: 6,
      })
      .withMessage("Please enter a valid password"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password!",
        });

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 86400 * 7,
        },
        (err, token) => {
          if (err) throw err;
          res
            .status(200)
            .cookie("auth", token, { maxAge: 86400000 * 7, httpOnly: true })
            .send();
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    const payload = {
      user: { id: user.id, isAdmin: user.isAdmin },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 * 7 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res
          .status(200)
          .cookie("auth", token, { maxAge: 86400000 * 7, httpOnly: true })
          .json(user);
      }
    );
  } catch (e) {
    res.status(400).send({ message: "Error in Fetching user" });
  }
});

router.get("/me/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send({ message: "Error in Fetching user" });
  }
});

router.put(
  "/me",
  [
    auth,
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a valid password"),
    body("name").notEmpty().withMessage("Please enter your full name here"),
    body("phone")
      .isMobilePhone()
      .withMessage("Please enter valid mobile phone number"),
    body("address.line1")
      .notEmpty()
      .withMessage("Line 1 of address is mandatory"),
    body("address.city").notEmpty().withMessage("Please enter a valid city"),
    body("address.state").notEmpty().withMessage("Please enter a state"),
    body("address.zip")
      .notEmpty()
      .isLength({ min: 5, max: 5 })
      .withMessage("Please enter a valid postal/ZIP code"),
  ],
  async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const newUser = await User.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.user.id),
        },
        { ...req.body },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json(newUser);
    } catch (e) {
      console.log(e);
      res.status(400).send({ message: "Error in updating user." });
    }
  }
);

/* router.post("/cart", auth, async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const qty = req.body.qty;
    if (itemId === null || qty === null) {
      throw { message: "Error adding to cart" };
    }
    const user = await User.findById(req.user.id);
    const item = await Item.findById(itemId);
    if (item === undefined) {
      throw { message: "Item ID not found in the store" };
    }
    const newCart = user.cart.filter((cartItem) => cartItem.itemId !== itemId);
    user.cart = [...newCart, { itemId: itemId, qty: qty }];
    await user.save();
    res.status(200).json(user.cart);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.delete("/cart/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error removing from cart" };
    }
    const user = await User.findById(req.user.id);
    const item = await Item.findById(itemId);
    const newCart = user.cart.filter((cartItem) => cartItem.itemId !== itemId);
    user.cart = [...newCart];
    await user.save();
    res.status(200).json(user.cart);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
}); */

router.get("/logout", async (req, res) => {
  res.status(200).clearCookie("auth").send();
});

module.exports = router;
