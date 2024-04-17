const users = require("../models/users");

const teachers = users.Teacher;
const students = users.Student;

module.exports.GetUserData = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const User = await users.User.findById(userId);
    if (!User) return res.status(404).json({ msg: "User not found" });
    res.locals.User = User;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
