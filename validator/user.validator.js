const joi = require("joi");

const userRegistrationValidator = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  username: joi.string().required(),
  password: joi.string().required(),
  phone_number: joi.string().required(),
  email: joi.string().email(),
});

module.exports = {
  userRegistrationValidator,
};
