const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const { GetUserData } = require("../middlewares/GetUserData");
const DashboardControllers = require("../controllers/DashboardControllers");
const { GetCoursesByStudent } = require("../middlewares/GetCourse_Student");
const {
  BootCampCertificate,
  CourseCertificate,
  Certificate,
} = require("../models/cerificates");
const { Student } = require("../models/users");
const { Course } = require("../models/courses");
const { GetCourseByTeacher } = require("../middlewares/GetCourse_Teacher");
const router = new Router();
// student
router.get(
  "/Dashboard/data",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserData
);

router.get(
  "/Dashboard/stats",
  TokenVerification,
  DashboardControllers.GetUserStats
);

router.get(
  "/Dashboard/products",
  TokenVerification,
  GetCoursesByStudent,
  DashboardControllers.GetUserProducts
);

router.get(
  "/Dashboard/completed-courses-per-month",
  TokenVerification,
  GetCoursesByStudent,
  DashboardControllers.GetStudentCompletedCoursesByMonth
);

router.get(
  "/Dashboard/CoursesProgress",
  TokenVerification,
  GetCoursesByStudent,
  DashboardControllers.GetAvgProgressCourses
);

//teacher

router.get(
  "/Dashboard/CourseStats",
  TokenVerification,
  GetCourseByTeacher,
  DashboardControllers.GetCoursesStats
);

router.get(
  "/Dashboard/agenda",
  TokenVerification,
  DashboardControllers.GetAgenda
);

router.get(
  "/Dashboard/sold-courses-per-month",
  TokenVerification,
  GetCourseByTeacher,
  DashboardControllers.GetSoldCoursesPerMonth
);

router.get(
  "/Dashboard/BestCourses",
  TokenVerification,
  GetCourseByTeacher,
  DashboardControllers.GetBestTeacherCourses
);
// test

// router.post("/test", async (req, res) => {
//   //creating two types of cerificates
//   try {
//     const course = await Course.findOne().exec();
//     const student = await Student.findOne().exec();
//     console.log(student);
//     const cert1 = await BootCampCertificate.create({
//       Title: "HTML1",
//       Student: student._id,
//     });
//     const cert2 = await Certificate.create({
//       Title: "HTML",
//       Student: student._id,
//       Course: course,
//     });
//     await cert1.save();
//     await cert2.save();
//     res.send("hey");
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
