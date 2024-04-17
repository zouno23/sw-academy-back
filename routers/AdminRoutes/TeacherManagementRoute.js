const Admincontroller = require("../../controllers/AdminController/TeacherManagement");
const { Router } = require("express");

const router = new Router();

router.post("/admin/AddTeacher" , Admincontroller.addTeacher);
// router.delete("/admin/DeleteTeacher" , Admincontroller.DeleteTeacher);
router.put("/admin/DeletePicture/Teacher" , Admincontroller.DeletePicture)
router.post("/admin/UpdateTeacher" , Admincontroller.Upadate);
router.get("/admin/Teacher",Admincontroller.getTeachers)
router.put("/admin/toggleStatus/Teacher" , Admincontroller.toggleStatus)





module.exports = router;
