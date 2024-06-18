const users = require("../models/users");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

async function generateQuiz() {
  const MODEL_NAME = "gemini-1.5-pro-latest";

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBLrcv03isef5CgS0OUVEv7JbS1YcQgotw"
  );
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt =
    'you are a quiz master.generate 10 random questions in computer science with 4 multiple choice answers.also provide the answer seperatly the response should be in the wollowung json format:{ "questions":[{id:0,"question":"","option":[],"answer":""},...]}';
  const result = await model.generateContent(prompt);
  const generatedText = result.response.text();
  const jsonData = generatedText.replace(/```json\n/, "").replace(/\n```/, ""); // Remove the backticks and extract the JSON data
  // console.log("JSON data:");
  // console.log(jsonData);
  const quizData = JSON.parse(jsonData); // Parse the JSON data
  // console.log(quizData);
  return quizData;
}

exports.getQuiz = async (req, res) => {
  try {
    const userId = res.locals.userId;
    console.log(userId);
    //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNjYzOGE4MDVmZWZjMTljNmIyYTUzNDVlIiwicm9sZSI6IlN0dWRlbnQiLCJpYXQiOjE3MTQ5ODkwNjF9.OUb79cKzRYFSG4R5HbCNi2nLN87b6e0vSuuL9WA8z7g;
    const userRole = res.locals.userRole;
    console.log("ddddddddd");
    const user = await users.Student.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const today = new Date();
    // console.log(today)

    if (
      user.Quiz.QuizList.length > 0 &&
      user.Quiz.QuizList[user.Quiz.QuizList.length - 1].date === today
    ) {
      return res.status(200).json({
        message: "no quiz today",
        details: "message ",
        Result: "no quiz",
      });
    } else {
      const quizData = await generateQuiz();
      return res.status(200).json({
        message: "quiz generated",
        details: "Response data will be a list of question with response",
        Result: quizData,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.SetScore = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    const score = req.body.score;

    const user = await users.Student.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.Quiz.QuizList) {
      user.Quiz.QuizList.push({ date: new Date(), score: req.body.score });
    } else {
      user.Quiz.QuizList = [{ date: new Date(), score: req.body.score }];
    }

    user.Quiz.ScoreTotal = (user.Quiz.ScoreTotal || 0) + req.body.score;

    return res.status(200).json({
      message: `successful setScore`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getQuizScores = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;

    const user = await users.Student.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const quizList = user.Quiz.QuizList;
    const lastTwoScores = quizList.slice(-2);
    const numberOfScores = lastTwoScores.length || 0;
    const today = new Date();
    let available;
    if (
      user.Quiz.QuizList.length > 0 &&
      user.Quiz.QuizList[user.Quiz.QuizList.length - 1].date === today
    ) {
      available = false;
    } else {
      available = true;
    }

    res.status(200).json({
      message: `successful }`,
      Result: {
        available: available,
        count: numberOfScores,
        totalScore: user.Quiz.ScoreTotal || 0,
        lastTwoScores: lastTwoScores,
      },
    }); // .json(lastTwoScores);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
