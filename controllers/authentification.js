const mongoose = require("mongoose");
const users = require("../models/users");

const teachers = users.Teacher;
const students = users.Student;

module.exports.signup_get_page = (req, res) => {
  res.send("sign up page");
};
module.exports.login_get_page = (req, res) => {
  res.send("login up page");
};
module.exports.signup_post_newAccount = async (req, res) => {
  try {
    const student = await students.create(req.body);
    student.save;
    res.send("done sign up ");
  } catch (err) {
    res.send("bug sign up");
  }
};
module.exports.login_get_account = (req, res) => {};
