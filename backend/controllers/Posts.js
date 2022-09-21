const Posts = require("../services/Posts");
const httpStatus = require("http-status");
const path = require("path");
class Post {
  async create(req, res, next) {
    try {
      req.body.user_id = req.user;
      const post = await Posts.insert(req.body);
      res.status(httpStatus.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const posts = await Posts.list();
      res.status(httpStatus.OK).send(posts);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params?.id) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Id bilgisi yok" });
      }

      const updatedPost = await Posts.update(req.params?.id, req.body);
      res.status(httpStatus.OK).send(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      if (!req.params?.id) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Id bilgisi yok" });
      }
      const deletedPost = await Posts.remove(req.params?.id);
      if (!deletedPost) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "boyle bir post bulunmamaktadir" });
      }
      res.status(httpStatus.OK).send({
        message: "post silinmistir",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateImage(req, res, next) {
    try {
      if (!req?.files?.image) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ error: "bu islemi yapabilmek icin veri yok" });
      }
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
      res.status(httpStatus.OK).send(updatedPost);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Post();
