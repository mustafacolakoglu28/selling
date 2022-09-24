const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    adress: {
      city: String,
      postalCode: String,
    },
    paymentMethod: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", OrderSchema);
