const { Lesson, Course } = require("../models/courses");

module.exports.NewLesson = async (lesson, res) => {
  try {
    const CourseId = res.locals.CourseId;
    const { Title, Description, Docs } = lesson;
    const newLesson = await Lesson.create({
      Title,
      Description,
      Course: CourseId,
      Documents: Docs,
    });
    if (!newLesson) {
      return res
        .status(400)
        .json({ message: "an error acquired while creating the lesson" });
    }
    newLesson.save();
    console.log("success");
    return { message: "successfull", Lesson: newLesson._id };
  } catch (error) {
    console.log("problem");
    return res
      .status(400)
      .json({ message: "an error acquired while creating course" });
  }
};

module.exports.NewCourse = async (course, res) => {
  try {
    const BootcampId = res.locals.BootcampId;
    const { Title, Description, Teacher, Field } = course;
    const newCourse = await Course.create({
      Title,
      Description,
      BootCamp: BootcampId,
      Field,
      IsLive: true,
      Teacher,
    });
    if (!newCourse) {
      return res
        .status(400)
        .json({ message: "an error acquired while creating the Course" });
    }
    newCourse.save();
    return { message: "successfull", Course: newCourse._id };
  } catch (error) {
    console.log("problem");
    return res
      .status(400)
      .json({ message: "an error acquired while creating course" });
  }
};
