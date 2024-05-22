const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../../core/env");

module.exports.VerifAdminToken = async (req, res, next) => {
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
    const admin = await Admin.findById(verified.identifier);
    if (!admin) {
      return res.status(404).json({ message: "User not found." });
    } else if (admin.Role !== verified.role) {
      return res.status(403).json({ message: "Forbidden access" });
    }
    res.locals.AdminRole = verified.role;
    res.locals.AdminId = verified.identifier;
    next();
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};
