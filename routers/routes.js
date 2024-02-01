const { Router } = require("express");
const authcontrollers = require("../controllers/authentification");

const router = new Router();

router.get("/", (req, res) => {
  res.send("server opened");
});

router.post("/signup", authcontrollers.signup_post_newAccount);

module.exports = router;
