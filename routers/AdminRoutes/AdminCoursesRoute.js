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
} = require("../../controllers/AdminController/AdminCoursesController");
const {
  uploadImage,
  uploadFile,
} = require("../../middlewares/UploadFileMiddelware");

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

// router.get("/Admin/All-Courses", VerifAdminToken, GetAllCourses);
module.exports = router;
