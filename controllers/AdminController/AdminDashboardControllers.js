const Admin = require("../../models/Admin");
const { Course } = require("../../models/courses");
const Users = require("../../models/users");
const moment = require("moment");
const { Student_Course } = require("../../models/courses");

const Teacher = Users.Teacher;
const Student = Users.Student;
const User = Users.User;
module.exports.getNumberOfUsers = async (req, res) => {
  const id = res.locals.AdminId;
  const role = res.locals.AdminRole;
  try {
    const students = await Student.find();
    const teachers = await Teacher.find();
    const admins = await Admin.find();
    res.status(200).json({
      message: "users found successfully",
      Result: {
        students: students.length,
        teachers: teachers.length,
        admins: admins.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.getCoursesNumbers = async (req, res) => {
  const id = res.locals.AdminId;
  const role = res.locals.AdminRole;
  try {
    const TotalCourses = await Course.find();
    const LiveCourses = TotalCourses.filter((course) => course.IsLive === true);

    res.status(200).json({
      message: "Courses Found successfully",
      Result: {
        LiveCourses: LiveCourses.length,
        TotalCourses: TotalCourses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetAllSoldCoursesPerMonth = async (req, res) => {
  var CoursesPerMonth = {};
  try {
    AllBoughtCourses = await Student_Course.find().populate("Course").exec();
    if (!AllBoughtCourses.length)
      return res.status(404).json({ message: "no courses found" });
    const thisYear = Date.now().getFullYear();
    const lastYear = thisYear - 1;
    for (const item of AllBoughtCourses) {
      const DateBought = new Date(item.DateStarted);
      const month = DateBought.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
      const year = DateBought.getFullYear();
      if (year >= lastYear) {
        CoursesPerMonth[year] = CoursesPerMonth[year] || {};
        CoursesPerMonth[year][month] = CoursesPerMonth[year][month] || 0;
        CoursesPerMonth[year][month]++;
      }
    }

    return res.status(200).json({
      Message: "Successfully retrieved sold courses per month.",
      Details:
        "Response data will be an object with years as key it's value  is an object with month numbers as keys and the number of sold Courses as values as Result",
      Result: CoursesPerMonth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
