const express = require("express");
const router = express();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", userController.registerUser);
router.get("/me", authMiddleware.verifyAuth, userController.getCurrentUser);

module.exports = router;
