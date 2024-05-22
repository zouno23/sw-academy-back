const { Router } = require("express");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const {
  getNumberOfUsers,
  getCoursesNumbers,
  GetAllSoldCoursesPerMonth,
} = require("../../controllers/AdminController/AdminDashboardControllers");
const router = new Router();

router.get("/Admin/Users-Numbers", VerifAdminToken, getNumberOfUsers);
router.get("/Admin/Courses-Numbers", VerifAdminToken, getCoursesNumbers);
router.get(
  "/Admin/SoldCoursesPerMonth",
  VerifAdminToken,
  GetAllSoldCoursesPerMonth
);
module.exports = router;
