const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const { GetUserData } = require("../middlewares/GetUserData");
const DashboardControllers = require("../controllers/DashboardControllers");
const { GetCoursesByStudent } = require("../middlewares/GetCourse_Student");
const router = new Router();
// student
router.get(
  "/Dashboard/data",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserData
);

// router.get(
//   "/Dashboard/stats",
//   TokenVerification,
//   GetUserData,
//   DashboardControllers.GetUserStats
// );

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

router.get("/Dashboard/");

module.exports = router;
