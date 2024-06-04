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

module.exports.GetAdminData = async (req, res) => {
  try {
    const AdminId = res.locals.AdminId;
    console.log(AdminId);
    const admin = await Admin.findById(AdminId);
    if (!admin) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "admin found successfully",
      Result: {
        _id: admin._id,
        Name: admin.Name,
        Email: admin.Email,
        Role: admin.Role,
        Picture: admin.Picture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.ChangeData = async (req, res) => {
  try {
    const AdminId = res.locals.AdminId;
    const admin = await Admin.findById(AdminId);
    if (!admin) {
      return res.status(404).json({ message: "User not found." });
    }
    admin.Picture = req.file?.path;
    admin.Name = req.body.Name || admin.Name;
    if (req.body.Password) admin.Password = req.body.Password;
    admin.Email = req.body.Email || admin.Email;
    admin.save();
    res.status(200).json({ message: "admin saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
