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
      throw new error(error);
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
