const users = require("../models/users");

const moment = require("moment");

const teachers = users.Teacher;
const students = users.Student;

module.exports.GetUserData = async (req, res) => {
  try {
    const User = res.locals.User;
    return res.status(200).json({
      message: "user found successfully",
      deatils: "Response data will be FullName,Email, ID & Picture as Result",
      Result: {
        FullName: User?.FullName,
        Email: User?.Email,
        Id: User?._id,
        Picture: User?.Picture,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports.GetUserStats = async (req, res) => {
//   try {
//     const User = res.locals.User;

//     return res.status(200).json({
//       message: "Stats found successfully",
//       details:
//         "Response data will be Lessons , CoursePacks , Certificates as Result",
//       Result: {
//         Lessons: User?.Lessons.length,
//         CoursePacks: User?.CoursePacks.length,
//         Certificates: User?.Certificates.length,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports.GetUserProducts = async (req, res) => {
  try {
    const Courses = res.locals.Courses;
    return res.status(200).json({
      message: "Products found successfully",
      deatils: "Response data will be Lessons , CoursePacks as Result",
      Result: {
        Courses: Courses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetStudentCompletedCoursesByMonth = async (req, res) => {
  var CoursesPerMonth = {};
  try {
    const Courses = res.locals.Courses;
    for (const item of Courses) {
      if (item.IsCompleted) {
        const DateCompleted = new Date(item.DateCompleted);
        const month = DateCompleted.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
        const year = DateCompleted.getFullYear();
        CoursesPerMonth[year] = CoursesPerMonth[year] || {};
        CoursesPerMonth[year][month] = CoursesPerMonth[year][month] || 0;
        CoursesPerMonth[year][month]++;
      }
    }
    return res.status(200).json({
      message: "Completed Courses per month calculated successfully",
      details:
        "Response data will be an object with month numbers as keys and the number of completed Courses as values as Result",
      Result: CoursesPerMonth,
    });
  } catch (error) {
    console.log("lessons per month error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetAvgProgressCourses = async (re, res) => {
  try {
    const Courses = res.locals.Courses;
    let sum = 0;
    let count = 0;
    for (const items of Courses) {
      if (!items.IsCompleted) {
        continue;
      }
      sum += parseInt(items.Progress) / 100;
      count++;
    }
    const Avg_progress = sum / count;
    return res.status(200).json({
      message: "Average progress calculated successfully",
      details: "Response data will be a Average containing the result",
      Average: Avg_progress || 0,
    });
  } catch (error) {
    console.log("Error in getting average progress");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
