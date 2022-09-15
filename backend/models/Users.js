const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    full_name: String,
    password: String,
    email: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("user", UserSchema);
