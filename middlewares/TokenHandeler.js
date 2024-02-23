const users = require("../models/users");
const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");

module.exports.TokenVerification = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ msg: "No auth token, access denied" });
    }
    const verified = jwt.verify(token, TokenSecretCode);
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied" });
    }
    res.locals.userRole = verified.role;
    res.locals.userId = verified.identifier;
    next();
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};
