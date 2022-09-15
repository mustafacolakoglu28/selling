const Post = require("../models/Posts");
const insert = (data) => {
  const post = new Post(data);
  return post.save();
};

const list = () => {
  return Post.find();
};

module.exports = {
  insert,
  list,
};
