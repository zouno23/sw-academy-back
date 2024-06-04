const {
  Course,
  BootCamp,
  Student_BootCamp,
  Lesson,
  Stream,
} = require("../../models/courses");
const { NewLesson, NewCourse } = require("../../utils/CourseUtils");
const { v4: uuidv4 } = require("uuid");
const v4options = {
  random: [
    0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1,
    0x67, 0x1c, 0x58, 0x36,
  ],
};
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
        Cover: camp.Cover,
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

module.exports.UploadToBootcamp = async (req, res) => {
  try {
    const BootcampId = await req.query.BootcampId;
    const camp = await BootCamp.findById(BootcampId);
    if (!camp) {
      return res.status(404).json({ message: "no such bootcamp found " });
    }
    const file = req.file;
    camp.Cover = file.path;
    await camp.save();
    return res.status(200).json({ message: "cover uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetBootCamp = async (req, res) => {
  const BootCampId = req.query.BootcampId;
  try {
    const camp = await BootCamp.findById(BootCampId);
    if (!camp) {
      return res
        .status(404)
        .json({ msg: "The Camp with the given ID was not found." });
    }
    const courses = await Course.find({ BootCamp: BootCampId })
      .populate({ path: "Teacher", select: "FullName _id" })
      .populate({ path: "Lessons", populate: "Streams" });

    let bootcamp = {
      _id: camp._id,
      Title: camp.Title,
      Description: camp.Description,
      StartingDate: camp.StartingDate,
      EndingDate: camp.EndingDate,
      Rating: camp.Rating,
      Field: camp.Field,
      Students: camp.Students,
      Cover: camp.Cover,
      Courses: courses,
    };

    return res
      .status(200)
      .json({ message: "camp found successfully", Result: bootcamp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.EditBootCamp = async (req, res) => {
  const BootCampId = req.query.BootcampId;
  try {
    const { Title, Description, Field } = req.body;
    const camp = await BootCamp.findById(BootCampId);
    if (!camp) {
      return res
        .status(404)
        .json({ msg: "The Camp with the given ID was not found." });
    }
    camp.Title = Title || camp.Title;
    camp.Description = Description || camp.Description;
    camp.Field = Field || camp.Field;
    camp.save();
    return res.status(200).json({ message: "camp edited successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.DeleteBootCamp = async (req, res) => {
  const BootCampId = req.query.BootcampId;
  try {
    const camp = await BootCamp.findByIdAndDelete(BootCampId);
    return res.status(200).json({ message: "Bootcamp Deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.AdminAddLiveCourse = async (req, res) => {
  try {
    const BootCampId = await req.query.BootcampId;
    res.locals.BootcampId = await BootCampId;
    const course = req.body;
    const id = await NewCourse(course, res);
    return res.status(200).json({ message: "Course added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.AdminNewStream = async (req, res) => {
  try {
    const { date, lesson, Teacher } = req.body;
    const SecretCode = uuidv4(v4options);
    const stream = await Stream.create({
      Lesson: lesson,
      SecretCode,
      Teacher,
      Date: date,
    });
    const l = await Lesson.findById(lesson);
    if (l.Streams) l.Streams.push(stream._id);
    else l.Streams = [stream._id];
    l.save();
    res
      .status(200)
      .json({ message: "meeting created successfully", Result: SecretCode });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
