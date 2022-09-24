const Orders = require("../services/Orders");
const Users = require("../services/Users");
const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

class Order {
  async create(req, res, next) {
    try {
      //console.log("req.user :>> ", req.user);
      req.body.user_id = req.user;
      const user = await Users.get(req.user?._id);
      if (!user) throw new ApiError("User not found", httpStatus.NOT_FOUND);
      const order = await Orders.insert(req.body);

      if (!order)
        throw new ApiError("Something went wrong", httpStatus.BAD_REQUEST);

      user.orders.push(order);
      await user.save();

      res.status(httpStatus.CREATED).send(order);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      if (!req?.params?.id)
        throw new ApiError("Order not found", httpStatus.NOT_FOUND);

      const user = await Users.get(req.user._id);
      if (!user) throw new ApiError("User not found", httpStatus.NOT_FOUND);

      const deletedOrder = await Orders.remove(req.params.id);
      if (!deletedOrder)
        throw new ApiError("order could not removed", httpStatus.NOT_FOUND);
      user.orders.pull(deletedOrder);
      await user.save();
      res.status(httpStatus.OK).send(deletedOrder);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Order();
