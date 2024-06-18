const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyDDg0cE7QOyKo6Xmx0JslAPor7SFd5V4zo"; // Store API key in an environment variable

exports.runChat = async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const chatResponse = await handleChat(userInput);
    sendResponse(res, chatResponse);
  } catch (error) {
    logError(error);
    sendErrorResponse(res, error);
  }
};

const handleChat = async (userInput) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });
  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
};

const sendResponse = (res, chatResponse) => {
  res.json({ text: chatResponse });
};

const sendErrorResponse = (res, error) => {
  res.status(500).json({ error: "Internal Server Error" });
};

const logError = (error) => {
  // Log error to a robust logging system, such as Winston or Morgan
  console.error(error);
};
