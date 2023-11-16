const express = require("express");
const router = express();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const USER_SCHEMA = require("../schemas/user.schema");
const { hashPassword } = require("../utils/password");

router.post("/", userController.registerUser);
router.post("/send-email", userController.sendEmail);
router.get("/me", authMiddleware.verifyAuth, userController.getCurrentUser);
router.get("/", authMiddleware.verifyAuth, userController.getUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", authMiddleware.verifyAuth, userController.updateUser);
router.put("/email/email-checker", async (req, res) => {
  const isExist = await USER_SCHEMA.findOne({ email: req.body.email })
    .lean()
    .exec();
  if (isExist) return res.json({ error: "email is already used." });
  res.json("proceed");
});
router.put("/", async (req, res) => {
  const password = await hashPassword(req.body.password);
  const user = await USER_SCHEMA.findOne({ email: req.body.email })
    .lean()
    .exec();

  const result = await USER_SCHEMA.findOneAndUpdate(
    { _id: user._id },
    {
      password,
    },
    { new: true, projection: { password: 0 } }
  )
    .lean()
    .exec();

  res.json(result);
});

module.exports = router;
