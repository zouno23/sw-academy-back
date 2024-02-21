const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");

const TokenAge = 60 * 60 * 24;

module.exports.TokenGenerator = (id) => {
  return jwt.sign({ identifier: id }, TokenSecretCode);
};
