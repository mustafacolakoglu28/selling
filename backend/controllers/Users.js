const {
  insert,
  list,
  loginUser,
  modify,
  remove,
} = require("../services/Users");
const postService = require("../services/Posts");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/userPassword");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "boyle bir kullanıcı yok" });

      user = {
        ...user.toObject(),
        tokens: {
          acces_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
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

const postlist = (req, res) => {
  postService
    .list({ user_id: req.user?._id })
    .then((posts) => {
      res.status(httpStatus.OK).send(posts);
    })
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Postlar yüklenirken hata olustu" });
    });
};

const resetPassword = (req, res) => {
  const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
    .then((updatedUser) => {
      if (!updatedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "boyle bir kullanici bulunamamaktadir" });
      console.log(updatedUser);
      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "sifre sifirlama",
        html: `sifre sifirlama isleminiz gerceklesti<br>giris yapiniz</br> yeni sifre: <b>${newPassword}</b>`, // html body
      });
      res
        .status(httpStatus.OK)
        .send({ message: "epostaniza bilgiler gonderildi" });
    })
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "sifre resetleme sirasinda bir hata olustu" });
    });
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "guncellemede hata olustu" })
    );
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "guncellemede hata olustu" })
    );
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Id bilgisi yok" });
  }
  remove(req.params?.id)
    .then((deletedUser) => {
      console.log("deletedUser :>> ", deletedUser);
      if (!deletedUser) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "boyle bir user bulunmamaktadir" });
      }
      res.status(httpStatus.OK).send({
        message: "user silinmistir",
      });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "user silme sirasinda bir problem olustu" })
    );
};

module.exports = {
  create,
  index,
  login,
  postlist,
  resetPassword,
  update,
  deleteUser,
  changePassword,
};
