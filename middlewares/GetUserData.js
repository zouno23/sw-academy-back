const users = require("../models/users");
const { Lesson, CoursePack } = require("../models/courses");
const {
  CourseCertificate,
  LessonCertificate,
} = require("../models/cerificates");
const teachers = users.Teacher;
const students = users.Student;

module.exports.GetUserData = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    var User;
    if (userRole == "Student") {
      User = await students
        .findById(userId)
        .populate("Lessons")
        .populate("CoursePacks")
        .populate("Certificates");
    } else if (userRole == "Teacher") {
      User = await teachers.findById(userId).populate("Lessons");
    }
    res.locals.User = User;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
