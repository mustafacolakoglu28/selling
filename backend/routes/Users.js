const express = require("express");
const UserController = require("../controllers/Users");
const schemas = require("../validations/Users");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", UserController.load);
router
  .route("/")
  .post(validate(schemas.createValidation), UserController.create);
router
  .route("/login")
  .post(validate(schemas.loginValidation), UserController.login);
router.route("/my-posts").get(authenticate, UserController.getMyPosts);
router.route("/my-orders").get(authenticate, UserController.getMyOrders);
router
  .route("/")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    UserController.update
  );
router.route("/:id").delete(authenticate, UserController.deleteUser);
router
  .route("/reset-password")
  .post(
    validate(schemas.resetPasswordValidation),
    UserController.resetPassword
  );

router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    UserController.changePassword
  );

module.exports = router;
