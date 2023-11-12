const inquiryService = require("../services/inquires.service");

const getInquiries = async (req, res) => {
  const inquires = await inquiryService.getAll(req.query);
  return res.json(inquires);
};

const updateStatus = async (req, res) => {
  const inquiry = await inquiryService.updateStatus(req.body);
  return res.json(inquiry);
};

module.exports = {
  getInquiries,
  updateStatus,
};
