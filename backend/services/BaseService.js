const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");

class BaseService {
  constructor(model) {
    this.model = model;
  }
  async insert(data) {
    try {
      const created = await new this.model(data);
      return created.save();
    } catch (error) {
      throw new error(error);
    }
  }

  async list(where) {
    try {
      return await this.model.find(where);
    } catch (error) {
      throw new ApiError("can not load", httpStatus.NOT_FOUND);
    }
  }

  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new error(error);
    }
  }

  async remove(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new error(error);
    }
  }

  async get(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new ApiError("something went wrong", httpStatus.NOT_FOUND);
    }
  }

  async getOne(condition) {
    try {
      return await this.model.findOne(condition);
    } catch (error) {
      throw new error(error);
    }
  }

  async updateOne(condition, data) {
    try {
      return await this.model.findOneAndUpdate(condition, data, { new: true });
    } catch (error) {
      throw new error(error);
    }
  }
}

module.exports = BaseService;
