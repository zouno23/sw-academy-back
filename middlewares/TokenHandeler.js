const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");

module.exports.TokenVerification = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      res.status(401).json({ msg: "No auth token, access denied" });
    } else {
      const verified = jwt.verify(token, TokenSecretCode);
      if (!verified) {
        res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied" });
      } else {
        const ExistUser = await users.Student.findOne({
          _id: verified.identifier,
        });
        res.locals.userRole(ExistUser.Role);
        res.locals.userId(ExistUser._id);
        next();
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};
