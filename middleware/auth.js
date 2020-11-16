const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.cookies.auth;
  if (!token)
    return res.status(401).json({ message: "Auth Error: no token set" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send({ message: "Auth Error: Invalid Token" });
  }
};
