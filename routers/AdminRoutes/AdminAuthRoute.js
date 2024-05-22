const { Router } = require("express");
const {
  AdminLogin,
  CreateAdmin,
  GetAdminData,
} = require("../../controllers/AdminController/AdminAuthController");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");

const router = new Router();

router.post("/Admin/login", AdminLogin);
router.post("/Admin/Add-Admin", CreateAdmin);

router.get("/Admin/GetData", VerifAdminToken, GetAdminData);
module.exports = router;
