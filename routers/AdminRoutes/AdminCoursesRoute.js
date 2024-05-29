const { Router } = require("express");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const {
  GetCoursesSample,
  GetBootcampsSample,
} = require("../../controllers/AdminController/AdminCoursesController");
const {
  GetAllCourses,
} = require("../../controllers/AdminController/AdminUsersController");
const router = new Router();

router.get("/Admin/Courses-Sample", VerifAdminToken, GetCoursesSample);
router.get("/Admin/Bootcamps-Sample", VerifAdminToken, GetBootcampsSample);

// router.get("/Admin/All-Courses", VerifAdminToken, GetAllCourses);
module.exports = router;
