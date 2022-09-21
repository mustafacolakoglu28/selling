const User = require("../models/Users");
const BaseService = require("./BaseService");

class Users extends BaseService {}

module.exports = new Users(User);
