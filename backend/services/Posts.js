const BaseService = require("./BaseService");
const Post = require("../models/Posts");

class Posts extends BaseService {}
module.exports = new Posts(Post);
