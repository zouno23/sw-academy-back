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
  UpdateLesson,
  DeleteLesson,
  AddLesson,
  UploadLessonsFile,
  DeleteCourse,
  GetTeacherLessons,
  FinishLesson,
} = require("../controllers/CourseControllers");
const {
  uploadFile,
  uploadImage,
  fileSetupMiddleware,
  uploadLessonFile,
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
  "/lesson/upload",
  TokenVerification,
  fileSetupMiddleware,
  uploadLessonFile.array("files", 5),
  UploadLessonsFile
);
router.post(
  "/courseCover",
  TokenVerification,
  uploadImage.single("file"),
  uploadCourseCover
);
router.put("/course", TokenVerification, UpdateCourse);
router.put("/lesson", TokenVerification, UpdateLesson);
router.delete("/lesson", TokenVerification, DeleteLesson);
router.post("/lesson", TokenVerification, AddLesson);
router.delete("/course", TokenVerification, DeleteCourse);
router.get("/lessons", TokenVerification, GetTeacherLessons);
router.put("/FinishLesson", TokenVerification, FinishLesson);
module.exports = router;
