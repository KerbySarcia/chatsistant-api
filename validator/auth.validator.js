const joi = require("joi");

const loginValidator = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

module.exports = {
  loginValidator,
};
