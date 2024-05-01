const {
  Student_Course,
  Course,
  CoursePack,

  Lesson,
} = require("../models/courses");
const { NewLesson } = require("../utils/CourseUtils");

//All
module.exports.GetCourses = async (req, res) => {
  userId = res.locals.userId;
  userRole = res.locals.userRole;
  try {
    let courses = [];
    let AllCourses = null;
    if (userRole == "Student") {
      const EveryCourse = await Course.find();
      AllCourses = EveryCourse;
      const Student_Courses = await Student_Course.find({
        Student: userId,
      }).populate("Course");
      courses = Student_Courses;
    } else if (userRole == "Teacher") {
      courses = await Course.find({ Teacher: userId });
    } else {
      return res.status(401).json({ msg: "you have no access to this page" });
    }

    if (!courses) {
      return res.status(401).json({ msg: "No Courses Found" });
    } else {
      return res.status(200).json({
        message: "courses found successfully",
        details: "courses will be in Result in a table form",
        Result: {
          AllCourses: AllCourses,
          MyCourses: courses,
        },
        role: userRole,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * This function handles GET requests to retrieve a specific course by its ID.
 * It is an asynchronous function that exports the GetCourse method.
 */
module.exports.GetCourse = async (req, res) => {
  // Get the course ID from the request query parameters
  const courseID = req.query.Id;

  try {
    // Find the course by its ID using the Course model's findById method
    const course = await Course.findById(courseID)
      .populate({ path: "Teacher", select: "FullName _id" })
      .populate("Lessons");

    // If the course is not found, return a 404 status code with an error message
    if (!course) {
      return res
        .status(404)
        .json({ msg: "The Course with the given ID was not found." });
    }

    // If the course is found, return a 200 status code with the course object
    return res.status(200).json({
      message: "course found successfully",
      details: "course will be in Result as one object",
      Result: course,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 status code with an error message
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

//Teacher
module.exports.PostNewCourse = async (req, res) => {
  // Get the user role and user id from the response local variables
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    // Check if the user role is Teacher
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
    // Create a new course object with the request body data
    const newCourse = await Course.create({
      Title: req.body.Title,
      Description: req.body.Description,
      Field: req.body.Field,
      RequiredLevel: req.body?.RequiredLevel || null,
      Teacher: userId,
      CoursePack: req.body?.CoursePack || null,
      IsLive: req.body?.IsLive || false,
      IsPublished: req.body?.IsPublished || false,
      Price: null,
      TimeRange: null,
    });
    newCourse.Price =
      (await newCourse.IsPublished) && (await !newCourse.IsLive)
        ? parseFloat(req.body.Price)
        : null;
    newCourse.TimeRange = (await newCourse.IsLive) ? req.body?.TimeRange : null;
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

module.exports.UpdateCourse = async (req, res) => {
  // Get the user role and user id from the response local variables
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    // Check if the user role is Teacher
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
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

module.exports.UploadFile = async (req, res) => {
  try {
    const userRole = res.locals.userRole;
    const userId = res.locals.userId;
    const course = await Course.findOne({
      Teacher: userId,
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
module.exports.uploadCourseCover = async (req, res) => {
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

module.exports.UpdateLesson = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    // Check if the user role is Teacher
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
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
module.exports.DeleteLesson = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    // Check if the user role is Teacher
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
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

module.exports.AddLesson = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
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

module.exports.UploadLessonsFile = async (req, res) => {
  try {
    const LessonId = await req.query.LessonId;
    const lesson = await Lesson.findById(LessonId);
    if (!lesson) {
      return res.status(404).json({ message: "No such lesson found!" });
    }
    const files = req.files;
    files.forEach((file) => {
      lesson.Documents.push(file.path);
    });
    await lesson.save();
    return res.status(200).json({ message: "sucessful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.DeleteCourse = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    if (userRole != "Teacher") {
      // If not, return a 401 status code with an unauthorized message
      return res.status(401).send("You are unauthorized");
    }
    const CourseId = await req.query.CourseId;
    const course = await Course.findByIdAndDelete(CourseId);
    if (!course) {
      return res.status(404).json({ message: "No such course found!" });
    }
    return res.status(200).json({ message: "sucessful" });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

//Student

module.exports.RateCourse = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    let New = false;
    if (userRole != "Student") {
      return res
        .status(403)
        .json({ message: "Only students can rate courses." });
    }
    const studentCourse = await Student_Course.findOne({
      Student: userId,
      Course: req.query.Id,
    });
    if (!studentCourse) {
      return res
        .status(404)
        .json({ message: "This student has no access to this course" });
    }
    let ratingValue = parseFloat(req.body.Rating);
    if (ratingValue > 5 || ratingValue < 0) {
      return res
        .status(400)
        .json({ message: "The Rating should be between 0 and 5" });
    }
    if (studentCourse.Rating == null) {
      New = true;
    }
    oldRating = await studentCourse.Rating;
    studentCourse.Rating = ratingValue;
    const course = await Course.findById(req.query.Id);
    if (New) {
      course.NumOfRatings = course.NumOfRatings + 1;
      if (course.Rating == null) {
        course.Rating = ratingValue;
      } else {
        const totalRatings =
          (course.Rating * (course.NumOfRatings - 1) + ratingValue) /
          course.NumOfRatings;
        course.Rating = totalRatings;
      }
    } else if (!New) {
      const totalRatings =
        (course.Rating * course.NumOfRatings - oldRating + ratingValue) /
        course.NumOfRatings;
      course.Rating = totalRatings;
    }
    await studentCourse.save();
    await course.save();
    return res.status(200).json({
      message: "You have successfully rated the course",
      details:
        "the response willl be Result having the new average rating of the course",
      Result: course.Rating,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports.BuyCourse = async (req, res) => {
  const userRole = res.locals.userRole;
  const userId = res.locals.userId;
  try {
    const courseId = req.query.Id;
    if (userRole != "Student") {
      return res
        .status(400)
        .json({ message: "Only students can buy courses." });
    }
    // Checking wether the course exists or not
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "No such course found!" });
    }
    // Checking whether the user has already bought this course or not
    const BoughtCourses = await Student_Course.findOne({
      Student: userId,
      Course: courseId,
    });
    if (BoughtCourses) {
      return res
        .status(409)
        .json({ message: "This course is already added to your basket!" });
    }
    const Relation = Student_Course.create({
      Student: userId,
      Course: courseId,
    });
    res.status(200).json({
      message: `The course has been added to your cart`,
      details: `You officially bought the course with th ID ${courseId}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};
