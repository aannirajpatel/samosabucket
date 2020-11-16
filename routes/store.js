const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const authAdmin = require("../middleware/authAdmin");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
require("dotenv").config();

router.use(cookieParser());

router.get("/", async (req, res) => {
  try {
    const storeItems = await Item.find({ available: true });
    if (storeItems === null) throw { message: "Nothing in the store yet" };
    res.status(200).json(storeItems);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const storeItem = await Item.findOne({ _id: req.params.id });
    if (storeItem === null)
      throw { message: "Nothing in the store with that id." };
    res.status(200).json(storeItem);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post("/search/", async (req, res) => {
  try {
    if (req.body.q === undefined || req.body.q == "") {
      return Item.find({ available: true })
        .then((data) => res.status(200).json(data))
        .catch((e) => res.status(400).json(e));
    }
    const items = await Item.find({
      $or: [
        { name: new RegExp(req.body.q, "i") },
        { description: new RegExp(req.body.q, "i") },
      ],
    });
    res.status(200).json(items);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/* router.post("/", authAdmin, async (req, res) => {
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
}); */

router.put("/:id", authAdmin, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error updating store." };
    }
    Item.findOneAndUpdate({ _id: itemId }, req.body, {
      useFindAndModify: false,
    })
      .then((item) => {
        Item.findById(item._id)
          .then((x) => {
            res.status(200).json(x);
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
