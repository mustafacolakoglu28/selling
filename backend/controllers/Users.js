const Users = require("../services/Users");
const Posts = require("../services/Posts");
const Orders = require("../services/Orders");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/userPassword");

class User {
  async create(req, res, next) {
    try {
      req.body.password = passwordToHash(req.body.password);
      const checkUser = await Users.getOne({ email: req.body.email });
      if (checkUser !== null)
        throw new ApiError("User already exist", httpStatus.NOT_FOUND);
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
      if (!user) throw new ApiError("User not found", http.NOT_FOUND);

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
      if (!users)
        throw new ApiError("There is no user yet", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(users);
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req, res, next) {
    try {
      const postsOfUser = await Posts.list({ user_id: req.user?._id });
      if (!postsOfUser)
        throw new ApiError("User has no post yet", httpStatus.NOT_FOUND);
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
      if (!updatedUser) throw new ApiError("User not found", http.NOT_FOUND);
      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "reset password",
        html: `your process is done<br>sign in</br> new passsword: <b>${newPassword}</b>`, // html body
      });
      res.status(httpStatus.OK).send({ message: "we sent an email to you " });
    } catch (error) {
      next(error);
    }
  }
  async getMyOrders(req, res, next) {
    const myOrders = await Orders.list({ user_id: req.user?._id });
    console.log("myOrders :>> ", myOrders);
    if (!myOrders) throw new ApiError("Orders not found", httpStatus.NOT_FOUND);
    res.status(httpStatus.OK).send(myOrders);
  }
  catch(error) {
    next(error);
  }

  async update(req, res, next) {
    try {
      const updatedUser = await Users.update({ _id: req.user?._id }, req.body);
      if (!updatedUser)
        throw new ApiError("User not found", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      req.body.password = passwordToHash(req.body.password);
      const updatedUser = await Users.update({ _id: req.user?._id }, req.body);
      if (!updatedUser)
        throw new ApiError("User not found", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      //Auth
      if (req.params?.id !== req.user_id)
        throw new ApiError("You can not do this", httpStatus.UNAUTHORIZED);
      if (!req?.params?.id)
        throw new ApiError("Something went wrong", httpStatus.BAD_REQUEST);
      const deletedUser = await Users.remove(req.params?.id);
      if (!deletedUser)
        throw new ApiError("User not found", httpStatus.NOT_FOUND);
      res.status(httpStatus.OK).send({
        message: "user silinmistir",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
