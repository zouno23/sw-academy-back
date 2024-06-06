const { Stream } = require("../models/courses");
const { v4: uuidv4 } = require("uuid");
const { Student, User } = require("../models/users");
const v4options = {
  random: [
    0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1,
    0x67, 0x1c, 0x58, 0x36,
  ],
};
module.exports.CheckForMeeting = async (req, res) => {
  const role = res.locals.role;
  const userId = res.locals.userId;
  try {
    const { SecretCode } = req.body;
    const stream = await Stream.findOne({ SecretCode });
    if (!stream) {
      return res
        .status(404)
        .json({ message: "No found meeting with this code" });
    }
    res.status(200).json({ message: "meeting found successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.CreateMeeting = async (req, res) => {
  const role = res.locals.role;
  const userId = res.locals.userId;
  try {
    if (role === "Student") {
      return res
        .status(402)
        .json({ message: "User has no access to start a meeting" });
    }
    const { LessonId, participants } = req.body;
    let Students = [];
    if (participants) {
      for (const email of participants) {
        const student = await User.findOne({ Email: email, Role: "Student" });
        if (student) Students.push(student._id);
      }
    }
    const SecretCode = uuidv4(v4options);
    const date = Date.now();
    const stream = await Stream.create({
      Lesson: LessonId,
      SecretCode,
      Teacher: userId,
      Date: date,
      Students: Students,
    });
    res
      .status(200)
      .json({ message: "meeting created successfully", Result: SecretCode });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.MeetingsList = async (req, res) => {
  const role = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    let streams;
    if (role === "Teacher") {
      streams = await Stream.find({ Teacher: userId }).populate("Lesson");
    } else if (role === "Student") {
      const Streams = await Stream.find().populate("Lesson");
      streams = Streams.filter((stream) => stream.Students.includes(userId));
    }
    if (!streams) {
      return res.status(404).json({ message: "no streams found for you" });
    }
    return res
      .status(200)
      .json({ message: "streams found successfully", Result: streams });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
