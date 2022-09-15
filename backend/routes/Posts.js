const express = require("express");
const { create, index } = require("../controllers/Posts");
const schemas = require("../validations/Posts");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(authenticate, index);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), create);

module.exports = router;
