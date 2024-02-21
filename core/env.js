const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  TokenSecretCode: process.env.TOKEN_SECRET,
  GoogleClientId: process.env.CLIENT_ID,
  GoogleClientSecret: process.env.CLIENT_SECRET,
};
