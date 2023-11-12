const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/auth.middleware");
const inquiresConroller = require("../controllers/inquiries.controller");

router.get("/", authMiddleware.verifyAuth, inquiresConroller.getInquiries);
router.put("/", authMiddleware.verifyAuth, inquiresConroller.updateStatus);

module.exports = router;
