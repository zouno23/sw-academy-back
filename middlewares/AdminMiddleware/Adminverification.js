const users = require("../../models/users");
const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../../core/env");
//test
module.exports.Adminverification = async (req, res, next) => {
  try {
    if (!(res.locals.userRole ==="Admin")){
      return res.status(401).json({ msg: "Access denied" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};
