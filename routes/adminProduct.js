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

/* 
Endpoint:
	GET  /adminproduct/

Purpose:
  Responds with an array

Credentials accepted: Admin only

Request Params: Empty

Request Body: Empty

Response:
  Responds with an array in JSON format containing all the Item objects in the store,
  sorted in descending order of their creation time
  
Example axios request:
const result = await axios({
  method: 'get',
  url: '/adminproduct/',
  withCredentials: true
});

 */
router.get("/", authAdmin, async (req, res) => {
  try {
    const items = await Item.find({}).sort({
      createdAt: -1,
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* 
Endpoint:
	POST  /adminproduct/list

Purpose:
	Retrieves a list of items whose id's are given in the request body, which is an array

Credentials accepted: Basic user, Admin

Request Body: An array of Item document id's.

Response:
  Responds with an array in JSON format containing the selected Item objects.
  
Example axios request:
const result = await axios({
  method: 'post',
  url: '/adminproduct/list/',
  withCredentials: true,
  data: [id1, id2,...],
});

 */
router.post("/list", auth, async (req, res) => {
  try {
    const itemIds = req.body.map((x) => mongoose.Types.ObjectId(x));
    const items = await Item.find({ _id: { $in: itemIds } });
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* 
Endpoint:
	POST  /adminproduct/

Purpose:
  Adds a new product item to the store

Credentials accepted: Admin only

Request Body: Is an object, with the following keys -
  imageUrl: URL of image of the new product
    type: String
    OPTIONAL
  
  name: The name of the new product.
    type: String
    REQUIRED
  description: Info about the new product
    type: String
    default: "Delicious!"
    OPTIONAL

  available: Set availability of the new product
    type: String
    default: "true"
    OPTIONAL
  
  price: Set price of the new product
    type: Number
    OPTIONAL (BUT RECOMMENDED, OF COURSE)
    default: 0.01

  createdAt: Set when the entry was made (usually not needed)
    type: Date
    default: Date.now()
    OPTIONAL

Response:
  Responds with an array in JSON format containing the selected Item objects.
  
Example axios request:
const result = await axios({
  method: 'post',
  url: '/adminproduct/',
  withCredentials: true,
  data: {imageUrl:"https://example.com/example.jpg",name:"Newfood",description:"Food info",available:"true",price:10},
});

 */
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

/* 
Endpoint:
	PUT  /adminproduct/:id
  Where ":id" is the id of the item to be updated
Purpose:
  Updates a product Item in the store given the document id of that Item.
  
Credentials accepted: Admin only

Request Body: Is an object, with the following keys -
  imageUrl: URL of image of the updated product
    type: String
    OPTIONAL
  
  name: The name of the updated product.
    type: String
    REQUIRED
  description: Info about the updated product
    type: String
    default: "Delicious!"
    OPTIONAL

  available: Set availability of the updated product
    type: String
    default: "true"
    OPTIONAL
  
  price: Set price of the updated product
    type: Number
    OPTIONAL (BUT RECOMMENDED, OF COURSE)
    default: 0.01

  createdAt: Set when the entry was made (usually not needed)
    type: Date
    default: Date.now()
    OPTIONAL

Response:
  Responds with an array in JSON format containing the selected Item objects.
  
Example axios request:
const result = await axios({
  method: 'put',
  url: '/adminproduct/'+id_of_item_to_be_updated,
  withCredentials: true,
  data: {imageUrl:"https://example.com/example.jpg",name:"Newfood",description:"Food info",available:"true",price:10},
});

 */

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
