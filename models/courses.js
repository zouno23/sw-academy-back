const mongoose = require("mongoose");
const { Student } = require("./users");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: false },
  Course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  Documents: [{ type: String, default: null }],
  Streams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stream" }],
});

const streamSchema = new Schema({
  Lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  Teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  Students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  Date: { type: Date },
  SecretCode: { type: String },
});

const courseSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Cover: { type: String },
  Field: { type: String, required: true },
  RequiredLevel: { type: String },
  TimeRange: { type: String },
  IsLive: { type: Boolean, default: "false" },
  IsPublished: { type: Boolean },
  Rating: { type: Number, min: 0, max: 5, default: null },
  NumOfRatings: { type: Number, default: 0 },
  Teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  Price: { type: Number },
  Sellings: { type: Number, default: 0 },
  Lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  BootCamp: { type: mongoose.Schema.Types.ObjectId, ref: "BootCamp" },
  Date: { type: Date },
});
courseSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.Date = await Date.now();
  }
  next();
});

const bootCampSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  StartingDate: { type: Date },
  EndingDate: { type: Date },
  Field: { type: String },
  Rating: { type: Number, min: 0, max: 5, default: null },
  Cover: { type: String },
});

const StudentBootCampSchema = new Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  BootCamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BootCamp",
    required: true,
  },
  DateStarted: { type: Date },
  Progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  IsCompleted: { type: Boolean, default: false },
  DateCompleted: { Date },
});
StudentBootCampSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.DateStarted = await Date.now();
    const student = await Student.findById(this.Student);
    let passage = student.BootCamps;
    passage.push(this._id);
    student.BootCamps = passage;
    student.save();
  }
  next();
});

const StudentCourseSchema = new Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  Course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  DateStarted: { type: Date, default: Date.now() },
  Progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  IsCompleted: { type: Boolean, default: false },
  DateCompleted: { type: Date, defaul: null },
  Rating: { type: Number, min: 0, max: 5, default: null },
});

StudentCourseSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.DateStarted = await Date.now();
    const student = await Student.findById(this.Student);
    let passage = student.Courses;
    passage.push(this._id);
    student.Courses = passage;
    student.save();
    const course = await Course.findById(this.Course);
    course.Sellings += 1;
    course.save();
  }
  next();
});
StudentCourseSchema.pre("deleteOne", async function (next) {
  const student = await Student.findById(this.Student);
  student.Courses.splice(student.Courses.indexOf(this._id), 1);
  student.save();
  next();
});

lessonSchema.pre(
  "remove",
  { document: true, query: false },
  async function (next) {
    try {
      const lesson = this;
      // Remove lesson from all courses that reference it
      await Course.updateMany(
        { lessons: lesson._id },
        { $pull: { lessons: lesson._id } }
      );
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Stream = mongoose.model("Stream", streamSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Course = mongoose.model("Course", courseSchema);
const BootCamp = mongoose.model("BootCamp", bootCampSchema);
const Student_Course = mongoose.model("Student_Course", StudentCourseSchema);
const Student_BootCamp = mongoose.model(
  "Student_BootCamp",
  StudentBootCampSchema
);

module.exports = {
  BootCamp,
  Course,
  Student_Course,
  Student_BootCamp,
  Stream,
  Lesson,
};
