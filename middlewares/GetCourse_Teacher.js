const { Course } = require("../models/courses");

module.exports.GetCourseByTeacher = async (req, res, next) => {
  const teacherId = res.locals.userId;
  const role = res.locals.userRole;
  try {
    // Get all courses by the teacher id from database
    const courses = await Course.find({ Teacher: teacherId });
    if (!courses) return res.status(401).json({ message: "No Courses found" });
    res.locals.Courses = courses;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
