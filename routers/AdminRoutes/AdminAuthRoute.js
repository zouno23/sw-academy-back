const { Router } = require("express");
const {
  AdminLogin,
  CreateAdmin,
  GetAdminData,
  ChangeData,
} = require("../../controllers/AdminController/AdminAuthController");
const {
  VerifAdminToken,
} = require("../../middlewares/AdminMiddleware/AdminTokenMiddleware");
const { upload } = require("../../middlewares/ImageMiddlware");

const router = new Router();

router.post("/Admin/login", AdminLogin);
router.post("/Admin/Add-Admin", CreateAdmin);

router.get("/Admin/GetData", VerifAdminToken, GetAdminData);

router.put(
  "/Admin/Settings",
  VerifAdminToken,
  upload.single("file"),
  ChangeData
);
module.exports = router;
