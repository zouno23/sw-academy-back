const users = require("../models/users");
const { Lesson, CoursePack } = require("../models/courses");
const {
  CourseCertificate,
  LessonCertificate,
} = require("../models/cerificates");
const teachers = users.Teacher;
const students = users.Student;

module.exports.GetUserData = async (req, res) => {
  try {
    const User = res.locals.User;

    return res.status(200).json({
      message: "user found successfully",
      deatils: "Response data will be FullName,Email, ID & Picture as Result",
      Result: {
        FullName: User.FullName,
        Email: User.Email,
        Id: User._id,
        Picture: User.Picture,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetUserStats = async (req, res) => {
  try {
    const User = res.locals.User;

    return res.status(200).json({
      message: "Stats found successfully",
      deatils:
        "Response data will be Lessons , CoursePacks , Certificates as Result",
      Result: {
        Lessons: User.Lessons.length,
        CoursePack: User.CoursePacks.length,
        Certificates: User.Certificates.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetUserProducts = async (req, res) => {
  try {
    const User = res.locals.User;

    return res.status(200).json({
      message: "Products found successfully",
      deatils: "Response data will be Lessons , CoursePacks as Result",
      Result: {
        Lessons: User.Lessons,
        CoursePack: User.CoursePacks,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
