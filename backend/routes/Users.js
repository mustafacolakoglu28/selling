const express = require("express");
const {
  create,
  index,
  login,
  postlist,
  resetPassword,
  update,
  deleteUser,
  changePassword,
} = require("../controllers/Users");
const schemas = require("../validations/Users");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/posts").get(authenticate, postlist);
router
  .route("/")
  .patch(authenticate, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticate, deleteUser);
router
  .route("/reset-password")
  .post(validate(schemas.resetPasswordValidation), resetPassword);

router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    changePassword
  );

module.exports = router;
