const express = require("express");
const router = express();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

module.exports = router;
