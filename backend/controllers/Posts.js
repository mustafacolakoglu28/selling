const { insert, list, modify, remove } = require("../services/Posts");
const httpStatus = require("http-status");
const path = require("path");

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Id bilgisi yok" });
  }

  modify(req.body, req.params?.id)
    .then((updatedProject) => res.status(httpStatus.OK).send(updatedProject))
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "kayit sirasinda bir problem olustu" })
    );
};

const deletePost = (req, res) => {
  if (!req.params?.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Id bilgisi yok" });
  }
  remove(req.params?.id)
    .then((deletedPost) => {
      console.log("deletedPost :>> ", deletedPost);
      if (!deletedPost) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "boyle bir post bulunmamaktadir" });
      }
      res.status(httpStatus.OK).send({
        message: "post silinmistir",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: " post silme sirasinda bir problem olustu" })
    );
};

const updateImage = (req, res) => {
  if (!req?.files?.image) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "bu islemi yapabilmek icin veri yok" });
  }

  const extension = path.extname(req.files.image.name);
  const fileName = `${req?.user._id}${extension}`;
  const folderPath = path.join(__dirname, "../", "/uploads/posts", fileName);
  req.files.image.mv(folderPath, function (err) {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    modify({ image: fileName }, { _id: req.params.id })
      .then((updatedPost) => {
        res.status(httpStatus.OK).send(updatedPost);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "kayit sirasinda problem olustu" })
      );
  });
};

module.exports = {
  create,
  index,
  update,
  deletePost,
  updateImage,
};
