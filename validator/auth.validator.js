const joi = require("joi");

const loginValidator = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

module.exports = {
  loginValidator,
};
