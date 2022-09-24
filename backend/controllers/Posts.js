const Posts = require("../services/Posts");
const Users = require("../services/Users");
const httpStatus = require("http-status");
const path = require("path");
const ApiError = require("../errors/ApiError");
class Post {
  async create(req, res, next) {
    try {
      req.body.user_id = req.user;
      const user = await Users.get(req.user?._id);
      if (!user) throw new ApiError("user not found", httpStatus.NOT_FOUND);
      const post = await Posts.insert(req.body);
      if (!post)
        throw new ApiError("Something went wrong", httpStatus.NOT_FOUND);

      user.posts.push(post);
      await user.save();
      res.status(httpStatus.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const posts = await Posts.list();
      if (!posts)
        throw new ApiError("Something went wrong ", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(posts);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params?.id)
        throw new ApiError("Id not found", httpStatus.BAD_REQUEST);

      const updatedPost = await Posts.update(req.params?.id, req.body);
      if (!updatedPost)
        throw new ApiError("Post not found", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      if (!req.params?.id) throw new ApiError("Id not found", http.BAD_REQUEST);

      const user = await Users.get(req.user?._id);
      if (!user) throw new ApiError("user not found", httpStatus.NOT_FOUND);
      const deletedPost = await Posts.remove(req.params?.id);
      if (!deletedPost) throw new ApiError("Post not found", http.NOT_FOUND);

      user.posts.pull(deletedPost);
      await user.save();

      res.status(httpStatus.OK).send({
        message: "post deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateImage(req, res, next) {
    try {
      if (!req?.files?.image)
        throw new ApiError("Please choose an image", httpStatus.BAD_REQUEST);
      const extension = path.extname(req.files.image.name);
      const fileName = `${req?.user._id}${extension}`;
      const folderPath = path.join(
        __dirname,
        "../",
        "/uploads/posts",
        fileName
      );
      req.files.image.mv(folderPath);
      const updatedPost = await Posts.update(
        { _id: req.params.id },
        { image: fileName }
      );
      if (!updatedPost)
        throw new ApiError("Post could not be updated", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(updatedPost);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Post();
