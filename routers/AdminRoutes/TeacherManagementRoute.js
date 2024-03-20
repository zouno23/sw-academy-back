const Admincontroller = require("../../controllers/AdminController/TeacherManagement");
const { Router } = require("express");

const router = new Router();

router.post("/admin/AddTeacher" , Admincontroller.addTeacher);
router.delete("/admin/DeleteTeacher" , Admincontroller.DeleteTeacher);
router.post("/admin/UpdateTeacher" , Admincontroller.Upadate);
router.get("/admin/UpdateTeacher",Admincontroller.getTeachers)



module.exports = router;
