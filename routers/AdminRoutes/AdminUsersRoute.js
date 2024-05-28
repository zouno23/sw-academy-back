const { Router } = require("express");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const {
  GetNewestTeachers,
  GetNewestStudents,
  GetNewestAdmins,
  GetAllTeachers,
  GetAllStudents,
  GetAllAdmins,
  CreateTeacher,
  CreateStudent,
  CreateAdmin,
  GetTeacher,
  GetTeacherCourses,
  GetTeacherCourseSellings,
  UpdateTeacher,
  GetStudent,
  GetStudentCourses,
  GetStudentCompletedCourses,
  UpdateStudent,
  AddStudentCourse,
  GetAllCourses,
  GetAllBootcamps,
} = require("../../controllers/AdminController/AdminUsersController");

const router = new Router();

router.get("/Admin/Recent-Teachers", VerifAdminToken, GetNewestTeachers); //
router.get("/Admin/Recent-Students", VerifAdminToken, GetNewestStudents); //
router.get("/Admin/Recent-Admins", VerifAdminToken, GetNewestAdmins); //

router.get("/Admin/All-Teachers", VerifAdminToken, GetAllTeachers); //
router.get("/Admin/All-Students", VerifAdminToken, GetAllStudents); //
router.get("/Admin/All-Admins", VerifAdminToken, GetAllAdmins); //

router.post("/Admin/Create-Teacher", VerifAdminToken, CreateTeacher); //
router.post("/Admin/Create-Student", VerifAdminToken, CreateStudent); //
router.post("/Admin/Create-Admin", VerifAdminToken, CreateAdmin); //

router.get("/Admin/Teacher", VerifAdminToken, GetTeacher); //
router.get("/Admin/Teacher-Courses", VerifAdminToken, GetTeacherCourses); //
router.get(
  "/Admin/Teacher-Sold-Courses",
  VerifAdminToken,
  GetTeacherCourseSellings
); //
router.put("/Admin/Teacher", VerifAdminToken, UpdateTeacher); //

router.get("/Admin/Student", VerifAdminToken, GetStudent); //
router.get("/Admin/Student-Courses", VerifAdminToken, GetStudentCourses); //
router.get(
  "/Admin/Student-Completed-Courses",
  VerifAdminToken,
  GetStudentCompletedCourses
); //
router.put("/Admin/Student", VerifAdminToken, UpdateStudent); //
router.post("/Admin/Add-Student-Course", VerifAdminToken, AddStudentCourse); //

router.get("/Admin/All-Courses", VerifAdminToken, GetAllCourses); //
router.get("/Admin/All-Bootcamps", VerifAdminToken, GetAllBootcamps);
module.exports = router;
