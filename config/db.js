const mongoose = require("mongoose");
const StartMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MONGODB Connected");
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = StartMongo;
