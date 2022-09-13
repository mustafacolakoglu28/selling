const mongoose = require("mongoose");

const db = mongoose.connection;

db.once("open", () => {
  console.log("db connected");
});

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
  connectDB,
};
