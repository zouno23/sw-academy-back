const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const { getBootCamps } = require("../controllers/BootcampsController");

const router = new Router();

router.get("/Bootcamps", TokenVerification, getBootCamps);
module.exports = router;
