const multer = require("multer");
const fs = require("fs");
const { Lesson, Course } = require("./../models/courses");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path =
      "Files/" +
      "Courses/" +
      req.headers.coursetitle +
      "/" +
      req.headers.lessontitle;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const name = file.originalname.split(".");
    const ext = name[name.length - 1];
    cb(
      null,
      req.headers.coursetitle +
        "_" +
        req.headers.lessontitle +
        Date.now() +
        "." +
        ext
    );
  },
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "Files/" + "Courses/" + req.headers.coursetitle + "/";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const name = file.originalname.split(".");
    const ext = name[name.length - 1];
    cb(null, req.headers.coursetitle + Date.now() + "." + ext);
  },
});
const uploadImage = multer({ storage: storage1 });
const uploadFile = multer({ storage: storage });

const fileSetupMiddleware = async (req, res, next) => {
  const role = res.locals.userRole;
  try {
    if (role != "Teacher") {
      return res.status(401).json({ message: "access denied" });
    }
    const LessonId = await req.query.LessonId;
    const CourseId = await req.query.CourseId;
    const lesson = await Lesson.findById(LessonId);
    if (!lesson) return res.status(402).json({ message: "lesson not found" });
    const course = await Course.findById(CourseId);
    if (!course) return res.status(402).json({ message: "course not found" });
    req.query.CourseTitle = course.Title;
    req.query.LessonTitle = lesson.Title;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    const path =
      "Files/" +
      "Courses/" +
      req.query.CourseTitle +
      "/" +
      req.query.LessonTitle;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const name = file.originalname.split(".");
    const ext = name[name.length - 1];
    cb(
      null,
      req.query.CourseTitle +
        "_" +
        req.query.LessonTitle +
        Date.now() +
        "." +
        ext
    );
  },
});

const uploadLessonFile = multer({ storage: storage2 });

const AdminFileSetupMiddleware = async (req, res, next) => {
  try {
    const LessonId = await req.query.LessonId;
    const CourseId = await req.query.CourseId;
    const lesson = await Lesson.findById(LessonId);
    if (!lesson) return res.status(402).json({ message: "lesson not found" });
    const course = await Course.findById(CourseId);
    if (!course) return res.status(402).json({ message: "course not found" });
    req.query.CourseTitle = course.Title;
    req.query.LessonTitle = lesson.Title;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  uploadFile,
  uploadImage,
  uploadLessonFile,
  fileSetupMiddleware,
  AdminFileSetupMiddleware,
};
