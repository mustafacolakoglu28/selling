const Post = require("../models/Posts");
const insert = (postData) => {
  const post = new Post(postData);
  return post.save();
};

const list = () => {
  return Post.find();
};

module.exports = {
  insert,
  list,
};
