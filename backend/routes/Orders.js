const express = require("express");
const schemas = require("../validations/Orders");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const OrderController = require("../controllers/Orders");
const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    OrderController.create
  );

router.route("/:id").delete(authenticate, OrderController.cancelOrder);

module.exports = router;
