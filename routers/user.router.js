const express = require("express");
const router = express();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", userController.registerUser);
router.post("/send-email", userController.sendEmail);
router.get("/me", authMiddleware.verifyAuth, userController.getCurrentUser);
router.get("/", authMiddleware.verifyAuth, userController.getUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", authMiddleware.verifyAuth, userController.updateUser);

module.exports = router;
