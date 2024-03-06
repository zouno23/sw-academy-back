const users = require("../models/users");
const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");
//test
module.exports.TokenVerification = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No auth token, access denied" });
    }
    const verified = jwt.verify(token, TokenSecretCode);
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied" });
    }
    const user = await users.User.findById(verified.identifier);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    } else if (user.Role !== verified.role)
      return res.status(403).json({ message: "Forbidden access" }); //Forbidden
    res.locals.userRole = verified.role;
    res.locals.userId = verified.identifier;
    next();
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};
