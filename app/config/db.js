const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MongoURl);
    console.log("Connected to database successfully!!");
  } catch (err) {
    console.log("Database connection unsuccessfull", err);
  }
};
module.exports = dbConnection;