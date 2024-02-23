const { Router } = require("express");
const authcontrollers = require("../controllers/authcontroller");

const router = new Router();

router.get("/", (req, res) => {
  res.send("server opened");
});

router.post("/signup", authcontrollers.signup_post);
router.post("/login", authcontrollers.login_post);
router.post("/login/google", authcontrollers.signin_oauth_google);

router.post("/forgot-password", authcontrollers.forgotPassword);
router.post("/frogot-password/VerifCode", authcontrollers.VerifCode);
router.post("/reset-password", authcontrollers.resetPass);

module.exports = router;
