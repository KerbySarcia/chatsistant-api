const express = require("express");
const router = express();
const userController = require("../controllers/user.controller");

router.post("/", userController.registerUser);

module.exports = router;
