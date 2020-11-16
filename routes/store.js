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

/* 
Endpoint:
	GET  /store/

Purpose:
  To fetch an array of available items, possibly based on some query text.

Credentials accepted: [None required]

Request Params:
  q: A query text to search for a particular available item.
    type: String
    OPTIONAL

Request Body: Empty

Response:
  Responds with an array in JSON format containing all the Item objects (or some of them that match
  the text query, if the parameter q has been provided...) in the store, sorted in ascending order
  of their names.

Example axios request:
const result = await axios({
  method: 'get',
  url: '/store/',
  params:{
    q:"samosa",
  }
});

 */

router.get("/", async (req, res) => {
  try {
    if (!req.params.q || req.params.q === undefined || req.params.q === "") {
      return Item.find({ available: true })
        .sort({ name: 1 })
        .then((data) => res.status(200).json(data))
        .catch((e) => res.status(400).json(e));
    }
    const items = await Item.find({
      $and: [
        {
          $or: [
            { name: new RegExp(req.body.q, "i") },
            { description: new RegExp(req.body.q, "i") },
          ],
        },
        { available: true },
      ],
    }).sort({ name: 1 });
    res.status(200).json(items);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
  /* 
  OLD CODE - only returned all available items, without search capability
  try {
    const storeItems = await Item.find({ available: true });
    if (storeItems === null) throw { message: "Nothing in the store yet" };
    res.status(200).json(storeItems);
  } catch (e) {
    res.status(400).send({ message: e.message });
  } */
});

/* 
Endpoint:
  GET  /store/:id
  Note: Replace ":id" in the above route with the id of the item to retrieve

Purpose:
  To fetch the details of an item from the data store.

Credentials accepted: [None required]

Request Params:
  This route does not accept request params, but the ID of the Item
	that should be retrieved must be specified in the URL.

Request Body: Empty

Response:
  Responds with a JSON object containing all the details of the requested Item object.

Example axios request:
const result = await axios({
  method: 'get',
  url: '/store/'+id_of_item_to_fetch,
});

 */

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

module.exports = router;
