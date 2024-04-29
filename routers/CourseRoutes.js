const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const {
  GetCourses,
  GetCourse,
  PostNewCourse,
  UpdateCourse,
  RateCourse,
  BuyCourse,
  UploadFile,
  uploadCourseCover,
} = require("../controllers/CourseControllers");
const {
  uploadFile,
  uploadImage,
} = require("../middlewares/UploadFileMiddelware");
const router = new Router();

router.get("/courses", TokenVerification, GetCourses);
router.get("/course", TokenVerification, GetCourse);

//Student
router.put("/course/rating", TokenVerification, RateCourse);
router.post("/buy-course", TokenVerification, BuyCourse);
// Teacher
router.post("/course", TokenVerification, PostNewCourse);
router.post(
  "/upload",
  TokenVerification,
  (req, res, next) => {
    const role = res.locals.userRole;
    if (role != "Teacher") {
      return res.status(401).json({ message: "access denied" });
    } else {
      return next();
    }
  },
  uploadFile.single("file"),
  UploadFile
);
router.post(
  "/courseCover",
  TokenVerification,
  uploadImage.single("file"),
  uploadCourseCover
);
router.put("/course", TokenVerification, UpdateCourse);

module.exports = router;
