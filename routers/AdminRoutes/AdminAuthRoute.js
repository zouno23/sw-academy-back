const { Router } = require("express");
const {
  AdminLogin,
  CreateAdmin,
} = require("../../controllers/AdminController/AdminAuthController");

const router = new Router();

router.post("/Admin/login", AdminLogin);
router.post("/Admin/Add-Admin", CreateAdmin);
module.exports = router;
