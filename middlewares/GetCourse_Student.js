const { Student_CoursePack, Student_Lesson } = require("../models/courses");

module.exports.GetLessonsByStudent = async (req, res, next) => {
  try {
    const studentId = res.locals.userId; // get the user id from the token
    const Lessons = await Student_Lesson.find({
      Student: studentId,
    }).populate("Lesson");
    if (!Lessons)
      return res.status(401).json({ message: "No completed lessons found" });
    res.locals.Lessons = Lessons;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
