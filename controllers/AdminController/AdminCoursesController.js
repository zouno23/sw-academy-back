const {
  Course,
  BootCamp,
  Student_BootCamp,
  Lesson,
} = require("../../models/courses");
const { NewLesson, NewCourse } = require("../../utils/CourseUtils");

module.exports.GetCoursesSample = async (req, res) => {
  try {
    const Sample = await Course.find({}).limit(5);
    if (!Sample) {
      return res.status(404).json({ message: "No Courses found" });
    }
    res
      .status(200)
      .json({ message: "Courses Sample found successfully", Result: Sample });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetBootcampsSample = async (req, res) => {
  try {
    const Sample = await BootCamp.find({}).limit(5);
    if (!Sample) {
      return res.status(404).json({ message: "No BootCamps found" });
    }
    let result = [];
    for (const camp of Sample) {
      const Bought = await Student_BootCamp.find({ BootCamp: camp._id });
      result.push({
        Title: camp.Title,
        _id: camp._id,
        Description: camp.Description,
        Field: camp.Field,
        Enrollements: Bought.length,
      });
    }
    res
      .status(200)
      .json({ message: "Bootcamps Sample found successfully", Result: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.NewCourse = async (req, res) => {
  try {
    // Create a new course object with the request body data
    const newCourse = await Course.create({
      Title: req.body.Title,
      Description: req.body.Description,
      Field: req.body.Field,
      RequiredLevel: req.body?.RequiredLevel || null,
      Teacher: req.body?.Teacher, // Testing missing
    });

    // creating Lessons and adding them to the course
    const Lessons = req.body.Lessons;
    let LessonsList = [];
    for (const Lesson of Lessons || []) {
      const result = await NewLesson(Lesson, res);
      LessonsList.push(result.Lesson);
    }
    newCourse.Lessons = LessonsList;
    newCourse.save();
    // If the course is created successfully, return a 201 status code with the course id
    return res.status(201).json({
      message: "Course created Successfully!",
      Details: `Course with id ${newCourse._id} has been created`,
      Result: newCourse,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
module.exports.CourseCover = async (req, res) => {
  try {
    const { id } = req.headers;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.Cover = req.file?.path;
    await course.save();
    return res.status(200).json({ message: "sucessful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
module.exports.AddFile = async (req, res) => {
  try {
    const course = await Course.findOne({
      Teacher: req.headers.teacher, // test missing
      Title: req.headers.coursetitle,
    }).populate("Lessons");
    for (const lesson of course.Lessons) {
      if (lesson.Title === req.headers.lessontitle) {
        const UpdateLesson = await Lesson.findById(lesson._id);
        let NewDocs = [];
        if (UpdateLesson.Documents) {
          NewDocs = UpdateLesson.Documents;
        }
        NewDocs.push(req.file.path);
        UpdateLesson.Documents = NewDocs;
        await UpdateLesson.save();
      }
    }
    return res.status(200).json({ message: "sucessful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.AdminDeleteCourse = async (req, res) => {
  try {
    const CourseId = await req.query.CourseId;
    const course = await Course.findByIdAndDelete(CourseId);
    if (!course) {
      return res.status(404).json({ message: "No such course found!" });
    }
    return res.status(200).json({ message: "sucessful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.AdminUpdateCourse = async (req, res) => {
  try {
    const courseID = await req.query.Id;
    const course = await Course.findByIdAndUpdate(courseID, {
      ...req.body,
    });
    if (!course) {
      return res.status(404).json({ message: "No such course found!" });
    }
    res.status(200).json({
      message: "Successfuly updated ",
      details: "new details of the course are as Result",
      Result: course,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.AdminUpdateLesson = async (req, res) => {
  try {
    const LessonID = await req.query.Id;
    const lesson = await Lesson.findByIdAndUpdate(LessonID, {
      ...req.body,
    });
    if (!lesson) {
      return res.status(404).json({ message: "No such lesson found!" });
    }
    res.status(200).json({
      message: "Successfuly updated ",
      details: "new details of the lesson are as Result",
      Result: lesson,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
module.exports.AdminDeleteLesson = async (req, res) => {
  try {
    const LessonID = await req.query.Id;
    const course = await Course.findOne({ Lessons: LessonID });
    course.Lessons.pull(LessonID);
    course.save();
    await Lesson.deleteOne({ _id: LessonID });
    res.status(200).json({
      message: "Successfuly deleted ",
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
module.exports.AdminAddLesson = async (req, res) => {
  try {
    const CourseId = await req.query.Id;
    const course = await Course.findOne({ _id: CourseId });
    const newLesson = await Lesson.create(req.body);
    course.Lessons.push(newLesson._id);
    course.save();
    res.status(200).json({
      message: "Successfuly Added Lesson ",
      Result: newLesson,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.AdminAddBootcamp = async (req, res) => {
  try {
    const Camp = req.body.Bootcamp;
    const Courses = req.body.Courses;
    const newCamp = await BootCamp.create(Camp);
    if (!newCamp) {
      return res.status(400).json({ message: "bootcamp coldn't be created" });
    }
    res.locals.BootcampId = newCamp._id;
    for (const course of Courses) {
      const id = await NewCourse(course, res);
    }
    return res
      .status(200)
      .json({ message: "Bootcamp Created Successfully", Result: newCamp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
