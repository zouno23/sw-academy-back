const { Router } = require("express");
const { TokenVerification } = require("../middlewares/TokenHandeler");
const {
  CreateMeeting,
  CheckForMeeting,
  MeetingsList,
  VerifyMeet,
} = require("../controllers/MeetingControllers");

const router = new Router();

router.post("/Meeting", TokenVerification, CreateMeeting);

router.post("/Check-Meeting", TokenVerification, CheckForMeeting);

router.get("/Meetings", TokenVerification, MeetingsList);
module.exports = router;
