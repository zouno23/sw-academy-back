const { TokenVerification } = require("../middlewares/TokenHandeler");
const { Router } = require("express");
const usercontroller = require("../controllers/userController");
const {upload}=require("../middlewares/ImageMiddlware")
const router = new Router();

router.post("/profile", TokenVerification, usercontroller.UpdateUser );
router.post("/profile/updateImg",upload.single('file'),usercontroller.UpdateUserImage)
module.exports = router;
