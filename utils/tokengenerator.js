const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");

const TokenAge = 60 * 60 * 24;

module.exports.TokenGenerator = (id, role) => {
  return jwt.sign({ identifier: id, role: role }, TokenSecretCode);
};
