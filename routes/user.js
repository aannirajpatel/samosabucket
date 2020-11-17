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

/* 
Endpoint:
	POST  /user/signup

Purpose:
  Creates a new User in the data store, and logs them in with those newly created user credentials.

Credentials accepted: [None required]

Request Params: Empty

Request Body: A JSON object, with the following keys -
  email: the e-mail address of the new user.
    type: String
    REQUIRED
  password: the password for the account of the new user
    type: String
    REQUIRED
  name: the full name of the new user
    type: String
    REQUIRED
  phone: the phone number of the new user
    type: String
    REQUIRED
  address: the full residence address of the new user
    type: JSON Object
    keys:
      line1: Line 1 of the user's residence address
        type: String
      line1: Line 2 of the user's residence address
        type: String
      city: Name of the city of the user's residence
        type: String
      state: Name of the state of the user's residence
        type: String
      zip: ZIP/postal code of the user's residence
        type: String
    REQUIRED  

Response:
  Sets an httpOnly cookie with the key "auth", and the value a JWT token that decrypts to give the user's
  unique MongoDB Document ID.

Example axios request:
const result = await axios({
  method: 'post',
  url: '/user/signup/',
  data:{
    email:"example@example.com",
    name:"John Doe",
    password:"abcdef",
    phone:"9191234567",
    address:{
      line1:"123, ABC St.",
      line2:"",
      city:"ABCD",
      state:"XYZ",
      zip: "12345"
    }
  }
});

 */

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Please enter a valid password, must be at least 6 characters long"
      ),
    body("name").notEmpty().withMessage("Please enter your full name here"),
    body("phone")
      .isMobilePhone()
      .withMessage("Please enter valid mobile phone number"),
    body("address.line1").notEmpty().withMessage("Address line 1 is required"),
    body("address.city").notEmpty().withMessage("Please enter a valid city"),
    body("address.state").notEmpty().withMessage("Please enter a state"),
    body("address.zip")
      .notEmpty()
      .withMessage("Please enter a valid postal/ZIP code")
      .isLength({ min: 5 })
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

/* 
Endpoint:
	POST  /user/login

Purpose:
  Processes the provided e-mail and password and logs the user in if the credentials matched the
  stored credentials.

Credentials accepted: [None required]

Request Params: Empty

Request Body: A JSON object, with the following keys -
  email: the e-mail address of the user.
    type: String
    REQUIRED
  password: the password for the account of the user
    type: String
    REQUIRED

Response:
  Sets an httpOnly cookie with the key "auth", and the value a JWT token that decrypts to give the user's
  unique MongoDB Document ID.

Example axios request:
const result = await axios({
  method: 'post',
  url: '/user/login/',
  data:{
    email:"example@example.com",
    password:"abcdef",
  }
});

 */

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

/* 
Endpoint:
	GET  /user/me

Purpose:
  Fetch a JSON object representing the logged-in user's corresponding user details document object.

Credentials accepted: Basic user, Admin

Request Params: Empty

Request Body: Empty

Response:
  Refreshes the httpOnly cookie with the key "auth" (that was already there)
  with an expiry of 7 days from the request time, and the value a JWT token that decrypts to give the user's
  unique MongoDB Document ID.
  Also sends back in JSON format, the user details MongoDB document object, of the format: {name, email, password, cart, phone, address, isAdmin, createdAt, updatedAt}

Example axios request:
const result = await axios({
  method: 'get',
  url: '/user/me/',
  withCredentials: true,
});

 */

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

/* 
Endpoint:
	GET  /user/me/:id

Purpose:
  Fetch a JSON object representing a particular, requested user's MongoDB document object.

Credentials accepted: Admin only

Request Params:
  id: id of the user whose details need to be fetched

Request Body: Empty

Response:
  In JSON format, the user details MongoDB document object, of the format: {name, email, password, cart, phone, address, isAdmin, createdAt, updatedAt}

Example axios request:
const result = await axios({
  method: 'get',
  url: '/user/me/'+id_of_user_to_fetch,
  withCredentials: true,
});

 */

router.get("/me/:id", authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send({ message: "Error in Fetching user" });
  }
});

/* 
Endpoint:
	PUT  /user/me

Purpose:
  To update the current user's information in the data store.

Credentials accepted: Basic user, Admin

Request Params: Empty

Request Body: A JSON object, with the following keys -
  email: the updated e-mail address of the user.
    type: String
    OPTIONAL
  password: the updated password for the account of the new user
    type: String
    OPTIONAL
  name: the updated full name of the user
    type: String
    OPTIONAL
  phone: the updated phone number of the updated user
    type: String
    OPTIONAL
  address: the updated full residence address of the user
    type: JSON Object
    keys:
      line1: Line 1 of the user's residence address
        type: String
      line1: Line 2 of the user's residence address
        type: String
      city: Name of the city of the user's residence
        type: String
      state: Name of the state of the user's residence
        type: String
      zip: ZIP/postal code of the user's residence
        type: String
    OPTIONAL  

Response:
  In JSON format, the updated user details MongoDB document object, of the format: {name, email, password, cart, phone, address, isAdmin, createdAt, updatedAt}

Example axios request:
const result = await axios({
  method: 'put',
  url: '/user/me/',
  withCredentials: true,
  data:{
    email:"example@example.com", //optional
    name:"John Doe", //optional
    password:"abcdef", //optional
    phone:"9191234567", //optional
    address:{           //optional
      line1:"123, ABC St.",
      line2:"",
      city:"ABCD",
      state:"XYZ",
      zip: "12345"
    }
  }
});

 */

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
    body("address.line1").notEmpty().withMessage("Address line 1 is required"),
    body("address.city").notEmpty().withMessage("Please enter a valid city"),
    body("address.state").notEmpty().withMessage("Please enter a state"),
    body("address.zip")
      .notEmpty()
      .withMessage("Please enter a valid postal/ZIP code")
      .isLength({ min: 5 })
      .withMessage("Please enter a valid postal/ZIP code"),
  ],
  async (req, res) => {
    try {
      if (req.body.email && req.body.email !== "") {
        const emailExists = await User.findOne({
          email: req.body.email,
          _id: { $ne: mongoose.Types.ObjectId(req.user.id) },
        });
        if (emailExists) {
          throw { message: "Email already exists in some other account." };
        }
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
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
      if (e.message) {
        res.status(400).send({ message: e.message });
      } else res.status(400).send({ message: "Error in updating user." });
    }
  }
);

/* 
Endpoint:
	GET  /user/logout

Purpose:
  To log the user out of the application.

Credentials accepted: [None required]

Request Params: Empty

Request Body: Empty

Response:
  Clears the "auth" httpOnly cookie that contains the JWT token
  (that token is what allows the user to stay logged in, and clearing the token clears that credential,
  hence technically logging them out).

Example axios request:
const result = await axios({
  method: 'get',
  url: '/user/logout/',
});

 */

router.get("/logout", async (req, res) => {
  res.status(200).clearCookie("auth").send();
});

module.exports = router;
