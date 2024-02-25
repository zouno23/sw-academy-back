const users = require("../models/users");
const { Lesson, CoursePack } = require("../models/courses");
const {
  CourseCertificate,
  LessonCertificate,
} = require("../models/cerificates");
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
    let Lessons = [];
    let CoursePacks = [];
    for (const item of User.CoursePacks) {
      CoursePacks.push(item.CoursePack);
    }
    for (const item of User.Lessons) {
      Lessons.push(item.Lesson);
    }
    return res.status(200).json({
      message: "Products found successfully",
      deatils: "Response data will be Lessons , CoursePacks as Result",
      Result: {
        Lessons: Lessons,
        CoursePack: CoursePacks,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetStudentCompletedLessonsByMonth = async (req, res) => {
  var LessonsPerMonth = {};
  try {
    const Lessons = res.locals.Lessons;
    for (const item of Lessons) {
      if (item.IsCompleted) {
        const DateCompleted = new Date(item.DateCompleted);
        const month = DateCompleted.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
        const year = DateCompleted.getFullYear();
        LessonsPerMonth[year] = LessonsPerMonth[year] || {};
        LessonsPerMonth[year][month] = LessonsPerMonth[year][month] || 0;
        LessonsPerMonth[year][month]++;
      }
    }
    return res.status(200).json({
      message: "Completed lessons per month calculated successfully",
      details:
        "Response data will be an object with month numbers as keys and the number of completed lessons as values as Result",
      Result: LessonsPerMonth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetAvgProgressLessons = async (re, res) => {
  try {
    const Lessons = res.locals.Lessons;
    let sum = 0;
    let count = 0;
    for (const items of Lessons) {
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
      Average: Avg_progress,
    });
  } catch (error) {
    console.log("Error in getting average progress");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
