const Order = require("../models/Orders");
const BaseService = require("./BaseService");

class Orders extends BaseService {}

module.exports = new Orders(Order);
