const joi = require("joi");

const userRegistrationValidator = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  password: joi.string().required(),
  email: joi.string().email().required(),
  role: joi.string().valid("USER", "STAFF", "ADMIN"),
});

module.exports = {
  userRegistrationValidator,
};
