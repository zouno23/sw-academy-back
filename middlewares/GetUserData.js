const users = require("../models/users");

const teachers = users.Teacher;
const students = users.Student;

module.exports.GetUserData = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    var User;
    if (userRole == "Student") {
      User = await students.findById(userId);
    } else if (userRole == "Teacher") {
      User = await teachers.findById(userId);
    }
    res.locals.User = User;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
