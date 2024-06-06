const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const {
  getBootCamps,
  GetCamp,
  RatingCamp,
} = require("../controllers/BootcampsController");

const router = new Router();

router.get("/Bootcamps", TokenVerification, getBootCamps);
router.get("/Bootcamp", TokenVerification, GetCamp);
router.put("/Bootcamp/Rate", TokenVerification, RatingCamp);

module.exports = router;
