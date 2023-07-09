require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const user = require("./routes/user");
const store = require("./routes/store");
const cart = require("./routes/cart");
const order = require("./routes/order");
const adminOrder = require("./routes/adminOrder");
const adminProduct = require("./routes/adminProduct");
const path = require("path");
const StartMongo = require("./config/db");
StartMongo();
const PORT = process.env.PORT || 5000;
app.use(cors({ credentials: true, origin: process.env.WEBAPP_ORIGIN ?? 'http://localhost:3000' }));
app.use(bodyParser.json());
/* BACKEND API ENDPOINTS */

app.use("/user", user);

app.use("/store", store);

app.use("/cart", cart);

app.use("/order", order);

app.use("/adminorder", adminOrder);

app.use("/adminproduct", adminProduct);

/* FOR SERVING THE REACT APP: */
if (process.env.SERVE_WEBAPP === 'TRUE') {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (request, res) => {
    res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
