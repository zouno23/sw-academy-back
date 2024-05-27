const { Router } = require("express");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const {
  getNumberOfUsers,
  getCoursesNumbers,
  GetAllSoldCoursesPerMonth,
  GetLatestCourses,
  GetMostActiveTeachers,
  GetMostActiveStudents,
} = require("../../controllers/AdminController/AdminDashboardControllers");
const router = new Router();

router.get("/Admin/Users-Numbers", VerifAdminToken, getNumberOfUsers);
router.get("/Admin/Courses-Numbers", VerifAdminToken, getCoursesNumbers);
router.get(
  "/Admin/SoldCoursesPerMonth",
  VerifAdminToken,
  GetAllSoldCoursesPerMonth
);

router.get("/Admin/Recent-Courses", VerifAdminToken, GetLatestCourses);
router.get("/Admin/GetBestTeachers", VerifAdminToken, GetMostActiveTeachers);
router.get("/Admin/GetBestStudents", GetMostActiveStudents);
module.exports = router;
