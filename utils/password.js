const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

const comparePassword = async (password, encryptedPassword) => {
  const isEqual = bcrypt.compareSync(password, encryptedPassword);
  return isEqual;
};

module.exports = {
  hashPassword,
  comparePassword,
};
