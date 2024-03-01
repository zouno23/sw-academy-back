const { Student_BootCamp, Student_Course } = require("../models/courses");

module.exports.GetCoursesByStudent = async (req, res, next) => {
  try {
    const studentId = res.locals.userId; // get the user id from the token
    const Courses = await Student_Course.find({
      Student: studentId,
    }).populate("Course");
    if (!Courses) return res.status(401).json({ message: "No Courses found" });
    res.locals.Courses = Courses;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetBootcampsByStudent = async (req, res, next) => {
  try {
    const studentId = res.locals.userId; // get the user id from the token
    const BootCamps = await Student_BootCamp.find({
      Student: studentId,
    }).populate("BootCamp");
    if (!BootCamps)
      return res.status(401).json({ message: "No Bootcamps found" });
    res.locals.BootCamps = BootCamps;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
