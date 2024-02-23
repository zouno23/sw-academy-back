const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("../models/users");
const axios = require("axios");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const { TokenSecretCode } = require("../core/env");
const { TokenGenerator } = require("../utils/tokengenerator");

const { generateCode } = require("../utils/codegen");

const teachers = users.Teacher;
const students = users.Student;

module.exports.signup_post = async (req, res) => {
  try {
    const student = await students.create(req.body);
    const token = TokenGenerator(student._id, student.Role);
    res.setHeader("jwt", token);
    student.save;
    res
      .status(200)
      .json({ message: `successful account creation for ${student.FullName}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    var user = await students.findOne({ Email });
    if (!user) {
      user = await teachers.findOne({ Email });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
    }
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "incorrect password" });
    }
    const token = TokenGenerator(user._id, user.Role);
    res.setHeader("jwt", token);
    return res
      .status(200)
      .json({ message: `successful authentification by ${user.FullName}` });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
    console.log(err);
  }
};

// sign up / log in using google open authentication 2 in the back
module.exports.signin_oauth_google = async (req, res) => {
  try {
    //we receive an access_token from the front where the user gave us access to gi google account
    const googletoken = await req.body.token;
    //we access the users google profile to verify the token and to get informations to either create him an account or grant him access to his account
    const googleprofile = await axios
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${googletoken}` },
      })
      .catch((error) => {
        return res.status(401).json("Wrong google access token");
      });
    // account existance verification using the google id
    const isStudentThere = await users.Student.findOne({
      GoogleId: googleprofile.data.id,
    });
    if (isStudentThere) {
      //if account does exist we grant access to the user
      const token = TokenGenerator(isStudentThere._id, isStudentThere.Role);
      res.setHeader("jwt", token);
      return res.status(200).json({ message: "successfull login" });
    }
    //else we create an account for the user and grant him access to it
    const googlestudent = await users.Student.create({
      FullName: googleprofile.data.name,
      Email: googleprofile.data.email,
      Password: googleprofile.data.id,
      GoogleId: googleprofile.data.id,
      Picture: googleprofile.data.picture,
    });
    googlestudent.save;
    const token = TokenGenerator(isStudentThere._id);
    res.setHeader("jwt", token);
    return res
      .status(200)
      .json({ message: "successfull account creation & login" });
  } catch (err) {
    return res.status(500).json({ message: "internal Server error" });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await users.Student.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // Générer un token de réinitialisation
    const code = generateCode();
    user.code = code;
    await user.save();
    console.log(user.Email, code);
    // sendEmail.sendEmail(user.Email, code);
    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal Server error" });
  }
};

module.exports.VerifCode = async (req, res) => {
  try {
    const { code } = await req.body;
    const user = await students.findOne({ code: code });
    if (!user) {
      return res.status(404).json({ message: "code invalid" });
    }
    const token = TokenGenerator(user._id, user.Role);
    res.setHeader("jwt", token);
    return res.status(200).json({ message: "code valid" });
  } catch (error) {
    return res.status(500).json({ message: "internal Server error" });
  }
};

module.exports.resetPass = async (req, res) => {
  try {
    const { Password } = req.body;
    // Vérifier la validité du token
    const token = req.headers.authorization;
    const tokenverified = jwt.verify(token, TokenSecretCode);
    const user = await students.findOne({ _id: tokenverified.identifier });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Cannot reset password please try again" });
    }
    user.Password = Password;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal Server error" });
  }
};
