const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../../core/env");
const { TokenGenerator } = require("../../utils/tokengenerator");
const bcrypt = require("bcrypt");

const Admin = require("../../models/Admin");

module.exports.AdminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const admin = await Admin.findOne({ Email });
    if (!admin) {
      return res.status(404).json({ message: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "incorrect password" });
    }
    const token = TokenGenerator(admin._id, admin.Role);
    res.setHeader("jwt", token);
    return res.status(200).json({
      message: `successful authentification by ${admin.FullName}`,
      Result: {
        userId: admin._id,
        userRole: admin.Role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
};

module.exports.CreateAdmin = async (req, res) => {
  try {
    const { Name, Password, Email, Role } = req.body;
    const newAdmin = await Admin.create({ Name, Password, Email, Role });
    const token = TokenGenerator(newAdmin._id, newAdmin.Role);
    res.setHeader("jwt", token);
    res.status(200).json({
      message: `successful account creation for ${newAdmin.FullName}`,
      Result: {
        userId: newAdmin._id,
        userRole: newAdmin.Role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
