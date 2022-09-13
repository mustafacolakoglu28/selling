const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    name: String,
    // content: String,
    // category: String,
    // user: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     autopopulate: true,
    //   },
    // ],
  },
  { timestamps: true, versionKey: false }
);

// schema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Post", PostSchema);
