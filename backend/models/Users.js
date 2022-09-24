const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    full_name: String,
    password: String,
    email: String,

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },

  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("user", UserSchema);
