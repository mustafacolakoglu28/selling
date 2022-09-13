const express = require("express");
const { create, index } = require("../controller/Posts");
const router = express.Router();

router.get("/", index);
router.post("/", create);

module.exports = router;
