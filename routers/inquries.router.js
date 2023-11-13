const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/auth.middleware");
const inquiresConroller = require("../controllers/inquiries.controller");
const schema = require("../services/number-of-inquiries.service");

router.get("/", authMiddleware.verifyAuth, inquiresConroller.getInquiries);
router.put("/", authMiddleware.verifyAuth, inquiresConroller.updateStatus);
router.get("/inquiries", authMiddleware.verifyAuth, async (req, res) => {
  const questions = await schema.getAll();
  res.json(questions);
});

module.exports = router;
