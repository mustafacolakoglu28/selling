const BaseService = require("./BaseService");
const Post = require("../models/Posts");

class Posts extends BaseService {
  async list(where) {
    try {
      return await this.model.find(where).populate({
        path: "user_id",
        select: "full_name email",
      });
    } catch (error) {
      throw new error(error);
    }
  }
}
module.exports = new Posts(Post);
