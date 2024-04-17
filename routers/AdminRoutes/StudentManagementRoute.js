const Admincontroller = require("../../controllers/AdminController/StudentManagementController");
const { Router } = require("express");

const router = new Router();

router.post("/admin/AddStudent" , Admincontroller.addStudent);
// router.delete("/admin/DeleteStudent" , Admincontroller.DeleteTeacher);
router.put("/admin/DeletePicture/Student" , Admincontroller.DeletePicture)
router.post("/admin/UpdateStudent" , Admincontroller.Upadate);
router.get("/admin/UpdateStudent",Admincontroller.getStudents)
router.put("/admin/toggleStatus/Student" , Admincontroller.toggleStatus)





module.exports = router;
