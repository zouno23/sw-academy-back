const users = require("../models/users");
const { Stream, Student_Course } = require("../models/courses");
const IsIdEqual = require("../utils/ObjComparaison");
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

// student

module.exports.GetUserStats = async (req, res) => {
  try {
    const Id = res.locals.userId;
    const User = await students.findById(Id);
    return res.status(200).json({
      message: "Stats found successfully",
      details:
        "Response data will be Courses , BootCamps , Certificates as Result",
      Result: {
        Courses: User?.Courses.length || 0,
        BootCamps: User?.BootCamps.length || 0,
        Certificates: User?.Certificates.length || 0,
      },
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetUserProducts = async (req, res) => {
  try {
    const Courses = res.locals.Courses;
    const sorted = Courses.sort((p1, p2) =>
      p1.Rating > p2.Rating ? -1 : p2.Rating > p1.Rating ? 1 : 0
    );
    const top5 = sorted.slice(0, 5);
    return res.status(200).json({
      message: "Products found successfully",
      deatils: "Response data will be Lessons , CoursePacks as Result",
      Result: {
        Courses: top5,
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
        "Response data will be an object with years as key it's value is an object with month numbers as keys and the number of completed Courses as values as Result",
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
      if (items.IsCompleted) {
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

// teacher

module.exports.GetCoursesStats = async (req, res) => {
  try {
    const Courses = res.locals.Courses;
    let sum = 0;
    let count = 0;
    let live = 0;
    for (const items of Courses) {
      if (items.IsLive) live++;
      if (items.Rating === null) continue;
      sum += items.Rating;
      count++;
    }
    const Avg_Rating = sum / count;
    return res.status(200).json({
      message: "Number of Total course by this Teacher is found Successfully",
      details:
        "Response data will be totalCourses and liveCourses and averageRating in Result",
      Result: {
        totalCourses: Courses.length,
        averageRating: Avg_Rating.toFixed(1) || 0,
        liveCourses: live,
      },
    });
  } catch (err) {
    console.log("Error in getting courses teacher stats ");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetAgenda = async (req, res) => {
  try {
    const TeacherId = res.locals.userId;
    const Streams = await Stream.find({ Teacher: TeacherId }).populate(
      "Lesson"
    );
    if (!Streams) res.status(401).json({ message: "No stream Found" });
    const Agenda = [];

    for (const item of Streams) {
      if (Date.now() > item.Date) continue;
      Agenda.push({
        start: item.Date,
        title: item?.Lesson.Title,
      });
    }
    res.status(200).json({
      message: "successful Agenda retrieval",
      details:
        "the response will be Result containing an array of each lesson title and it's Time and the sessions length in minutes : Lesson:string , Time:Date , Length:number ",
      Result: Agenda,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetSoldCoursesPerMonth = async (req, res) => {
  var CoursesPerMonth = {};
  try {
    const Courses = res.locals.Courses;
    AllBoughtCourses = await Student_Course.find().populate("Course").exec();
    if (!AllBoughtCourses.length)
      return res.status(404).json({ message: "no courses found" });
    for (const item of AllBoughtCourses) {
      if (Courses.filter((value) => IsIdEqual(value, item.Course)).length > 0) {
        const DateBought = new Date(item.DateStarted);
        const month = DateBought.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
        const year = DateBought.getFullYear();
        CoursesPerMonth[year] = CoursesPerMonth[year] || {};
        CoursesPerMonth[year][month] = CoursesPerMonth[year][month] || 0;
        CoursesPerMonth[year][month]++;
      }
      console.log("got here 3");
      return res.status(200).json({
        Message: "Successfully retrieved sold courses per month.",
        Details:
          "Response data will be an object with years as key it's value  is an object with month numbers as keys and the number of sold Courses as values as Result",
        Result: CoursesPerMonth,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetBestTeacherCourses = async (req, res) => {
  try {
    const Courses = res.locals.Courses;
    const sorted = Courses.sort((p1, p2) =>
      p1.Rating > p2.Rating ? -1 : p2.Rating > p1.Rating ? 1 : 0
    );
    const top5 = sorted.slice(0, 5);
    res.status(200).json({
      message: "Best Courses calculated successfully",
      details:
        "the result is as follows: Result in it there is an array of organized courses from best to 5th best",
      Result: top5,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
