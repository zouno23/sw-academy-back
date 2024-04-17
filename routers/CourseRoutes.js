const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const {
  GetCourses,
  GetCourse,
  PostNewCourse,
  UpdateCourse,
  RateCourse,
  BuyCourse,
} = require("../controllers/CourseControllers");
const router = new Router();

router.get("/courses", TokenVerification, GetCourses);
router.get("/course", TokenVerification, GetCourse);

//Student
router.put("/course/rating", TokenVerification, RateCourse);
router.post("/buy-course", TokenVerification, BuyCourse);
// Teacher
router.post("/course", TokenVerification, PostNewCourse);
router.put("/course", TokenVerification, UpdateCourse);

module.exports = router;
