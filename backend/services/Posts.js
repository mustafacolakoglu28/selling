const Post = require("../models/Posts");
const insert = (data) => {
  const post = new Post(data);
  return post.save();
};

const list = (where) => {
  return Post.find(where || {}).populate({
    path: "user_id",
    select: "full_name email",
  });
};

const modify = (postData, id) => {
  return Post.findByIdAndUpdate(id, postData, { new: true });
};

const remove = (id) => {
  return Post.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
};
