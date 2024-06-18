const { TokenVerification } = require("../middlewares/TokenHandeler");
const { Router } = require("express");
const usercontroller = require("../controllers/userController");
const { upload } = require("../middlewares/ImageMiddlware");
const ChatBotController = require("../controllers/ChatBotController");
const quizController = require("../controllers/quizController");
const router = new Router();

router.post("/profile", TokenVerification, usercontroller.UpdateUser);
router.post(
  "/profile/updateImg",
  TokenVerification,
  upload.single("file"),
  usercontroller.UpdateUserImage
);
router.get("/quiz", TokenVerification, quizController.getQuiz);
router.get("/QuizScores", TokenVerification, quizController.getQuizScores);
//
router.post("/chatbot", ChatBotController.runChat);

module.exports = router;
