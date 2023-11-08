const { get, isEmpty } = require("lodash");
const jwt = require("jsonwebtoken");
const PASS_PHRASE = get(process, "env.AUTH_TOKEN_SECRET", "chatsistant");
const userService = require("../services/user.service");

const verifyAuth = async (req, res, next) => {
  const authToken = get(req, "headers.authorization", "");

  if (!authToken)
    return res.status(400).json({ message: "Missing authorization header." });

  try {
    const token = authToken.replace("Bearer ", "");

    const verifiedToken = jwt.verify(token, PASS_PHRASE);

    const userId = get(verifiedToken, "id", "");

    if (!isEmpty(verifiedToken) && userId) {
      const user = await userService.findUser({ _id: userId });

      if (!user)
        return res.status(401).json({ message: "User does not exist." });
      req.user = user;
      res.locals.currentUser = user;
      next();
    } else {
      return res
        .status(400)
        .json({ message: "Malformed authorization token." });
    }
  } catch (error) {
    return res.status(401).json({
      message:
        "Unauthorized access. Kindly revalidate your authorization token.",
    });
  }
};

module.exports = {
  verifyAuth,
};
