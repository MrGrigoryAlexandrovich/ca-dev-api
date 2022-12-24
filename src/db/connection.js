const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB connected : ${con.connection.host}`); // eslint-disable-line
  } catch (err) {
    console.log(err); // eslint-disable-line
    process.exit(1);
  }
};

module.exports = connectDB;
