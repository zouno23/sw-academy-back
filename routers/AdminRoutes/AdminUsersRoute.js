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
} = require("../../controllers/AdminController/AdminUsersController");

const router = new Router();

router.get("/Admin/Recent-Teachers", VerifAdminToken, GetNewestTeachers);
router.get("/Admin/Recent-Students", VerifAdminToken, GetNewestStudents);
router.get("/Admin/Recent-Admins", VerifAdminToken, GetNewestAdmins);

router.get("/Admin/All-Teachers", VerifAdminToken, GetAllTeachers);
router.get("/Admin/All-Students", VerifAdminToken, GetAllStudents);
router.get("/Admin/All-Admins", VerifAdminToken, GetAllAdmins);

router.post("/Admin/Create-Teacher", VerifAdminToken, CreateTeacher);
router.post("/Admin/Create-Student", VerifAdminToken, CreateStudent);
router.post("/Admin/Create-Admin", VerifAdminToken, CreateAdmin);

router.get("/Admin/Teacher", VerifAdminToken, GetTeacher);
router.get("/Admin/Teacher-Courses", VerifAdminToken, GetTeacherCourses);
router.get(
  "/Admin/Teacher-Sold-Courses",
  VerifAdminToken,
  GetTeacherCourseSellings
);

router.put("/Admin/Teacher", VerifAdminToken, UpdateTeacher);
module.exports = router;
