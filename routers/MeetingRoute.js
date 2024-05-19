const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const {
  CreateMeeting,
  CheckForMeeting,
} = require("../controllers/MeetingControllers");

const router = new Router();

router.post("/Meeting", TokenVerification, CreateMeeting);

router.get("/Check-Meeting", TokenVerification, CheckForMeeting);

module.exports = router;
