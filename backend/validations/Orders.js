const joi = require("joi");

const createValidation = joi.object({
  items: joi.required(),
  adress: {
    city: joi.string().required().min(5).max(100),
    postalCode: joi.string().required().min(2).max(5),
  },
  paymentMethod: joi.string().required(),
});

module.exports = { createValidation };
