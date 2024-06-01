const { Router } = require("express");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const {
  GetCoursesSample,
  GetBootcampsSample,
  NewCourse,
  CourseCover,
  AddFile,
  AdminDeleteCourse,
  AdminUpdateCourse,
  AdminUpdateLesson,
  AdminDeleteLesson,
  AdminAddLesson,
  GetAllBootcamps,
  AdminAddBootcamp,
} = require("../../controllers/AdminController/AdminCoursesController");
const {
  uploadImage,
  uploadFile,
  AdminFileSetupMiddleware,
  uploadLessonFile,
} = require("../../middlewares/UploadFileMiddelware");
const {
  GetCourse,
  UploadLessonsFile,
} = require("../../controllers/CourseControllers");

const router = new Router();

router.get("/Admin/Courses-Sample", VerifAdminToken, GetCoursesSample);
router.get("/Admin/Bootcamps-Sample", VerifAdminToken, GetBootcampsSample);

router.post("/Admin/Course", VerifAdminToken, NewCourse);
router.post(
  "/Admin/CourseCover",
  VerifAdminToken,
  uploadImage.single("file"),
  CourseCover
);
router.post(
  "/Admin/Upload",
  VerifAdminToken,
  uploadFile.single("file"),
  AddFile
);

router.get("/Admin/Course", VerifAdminToken, GetCourse);
router.delete("/Admin/Course", VerifAdminToken, AdminDeleteCourse);
router.put("/Admin/Course", VerifAdminToken, AdminUpdateCourse);

router.post("/Admin/Lesson", VerifAdminToken, AdminAddLesson);
router.put("/Admin/Lesson", VerifAdminToken, AdminUpdateLesson);
router.delete("/Admin/Lesson", VerifAdminToken, AdminDeleteLesson);
router.post(
  "/Admin/Lesson/Upload",
  VerifAdminToken,
  AdminFileSetupMiddleware,
  uploadLessonFile.array("files", 5),
  UploadLessonsFile
);

router.post("/Admin/Bootcamp", VerifAdminToken, AdminAddBootcamp);

module.exports = router;
