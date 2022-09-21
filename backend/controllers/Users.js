const Users = require("../services/Users");
const Posts = require("../services/Posts");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/userPassword");

class User {
  async create(req, res, next) {
    try {
      req.body.password = passwordToHash(req.body.password);
      const user = await Users.insert(req.body);
      res.status(httpStatus.CREATED).send(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      req.body.password = passwordToHash(req.body.password);
      const user = await Users.getOne(req.body);
      if (!user)
        res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "boyle bir kullanıcı yok" });

      let currentUser = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };

      res.status(httpStatus.OK).send(currentUser);
    } catch (error) {
      next(error);
    }
  }

  async load(req, res, next) {
    try {
      const users = await Users.list();
      res.status(httpStatus.OK).send(users);
    } catch (error) {
      next(error);
    }
  }

  async postlist(req, res, next) {
    try {
      const postsOfUser = await Posts.list({ user_id: req.user?._id });
      res.status(httpStatus.OK).send(postsOfUser);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const newPassword =
        uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
      const updatedUser = await Users.updateOne(
        { email: req.body.email },
        { password: passwordToHash(newPassword) }
      );
      if (!updatedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "boyle bir kullanici bulunamamaktadir" });
      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "sifre sifirlama",
        html: `sifre sifirlama isleminiz gerceklesti<br>giris yapiniz</br> yeni sifre: <b>${newPassword}</b>`, // html body
      });
      res
        .status(httpStatus.OK)
        .send({ message: "epostaniza bilgiler gonderildi" });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updatedUser = await Users.update({ _id: req.user?._id }, req.body);
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      req.body.password = passwordToHash(req.body.password);
      const updatedUser = await Users.update({ _id: req.user?._id }, req.body);
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      if (!req.params?.id) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "Id bilgisi yok" });
      }
      const deletedUser = await Users.remove(req.params?.id);
      if (!deletedUser) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: "boyle bir user bulunmamaktadir" });
      }
      res.status(httpStatus.OK).send({
        message: "user silinmistir",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
