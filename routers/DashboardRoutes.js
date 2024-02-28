const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const { GetUserData } = require("../middlewares/GetUserData");
const DashboardControllers = require("../controllers/DashboardControllers");
const { GetLessonsByStudent } = require("../middlewares/GetCourse_Student");
const router = new Router();

router.get(
  "/Dashboard/data",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserData
);

router.get(
  "/Dashboard/stats",
  TokenVerification,
  GetUserData,
  DashboardControllers.GetUserStats
);

router.get(
  "/Dashboard/products",
  TokenVerification,
  GetLessonsByStudent,
  DashboardControllers.GetUserProducts
);

router.get(
  "/Dashboard/completed-lessons-per-month",
  TokenVerification,
  GetLessonsByStudent,
  DashboardControllers.GetStudentCompletedLessonsByMonth
);

router.get(
  "/Dashboard/LessonsProgress",
  TokenVerification,
  GetLessonsByStudent,
  DashboardControllers.GetAvgProgressLessons
);
module.exports = router;
