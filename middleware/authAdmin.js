const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.cookies.auth;
  if (!token)
    return res.status(401).json({ message: "Auth Error: no token set" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if (!req.user.isAdmin)
      throw { message: "Auth Error: invalid token, or you are not admin" };
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send(e.message);
  }
};
