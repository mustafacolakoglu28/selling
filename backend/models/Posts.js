const mongoose = require("mongoose");
const logger = require("../scripts/logger/Posts");

const PostSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    // content: String,
    // category: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

PostSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = mongoose.model("Post", PostSchema);
