const express = require("express");
const {
  create,
  index,
  update,
  deletePost,
  updateImage,
} = require("../controllers/Posts");
const schemas = require("../validations/Posts");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(authenticate, index);
router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), create);
router
  .route("/:id")
  .patch(authenticate, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticate, deletePost);
router.route("/:id/update-image").post(authenticate, updateImage);

module.exports = router;
