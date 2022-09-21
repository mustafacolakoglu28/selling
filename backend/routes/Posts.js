const express = require("express");
const PostController = require("../controllers/Posts");
const schemas = require("../validations/Posts");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.route("/").get(authenticate, PostController.index);
router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    PostController.create
  );
router
  .route("/:id")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    PostController.update
  );
router.route("/:id").delete(authenticate, PostController.deletePost);
router
  .route("/:id/update-image")
  .post(authenticate, PostController.updateImage);

module.exports = router;
