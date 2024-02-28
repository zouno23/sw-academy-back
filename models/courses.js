const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Field: { type: String, required: true },
  RequiredLevel: { type: String, required: true },
  TimeRange: { type: String },
  IsLive: { type: Boolean },
  IsPublished: { type: Boolean },
  course: { type: { type: mongoose.Schema.Types.ObjectId, ref: "course" } },
  Teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
});

const courseSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Field: { type: String, required: true },
  TimeRange: { type: String },
  Lessons: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "lesson" }] },
});

const coursePackSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  TimeRange: { type: String },
  courses: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
  },
});

const StudentCoursePackSchema = new Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  CoursePack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoursePack",
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
  DateCompleted: { Date },
});

const StudentLessonSchema = new Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  Lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
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
});

const Lesson = mongoose.model("Lesson", lessonSchema);
const Course = mongoose.model("Course", courseSchema);
const CoursePack = mongoose.model("CoursePack", coursePackSchema);
const Student_Lesson = mongoose.model("Student_Lesson", StudentLessonSchema);
const Student_CoursePack = mongoose.model(
  "Student_CoursePack",
  StudentCoursePackSchema
);

module.exports = {
  Lesson,
  Course,
  CoursePack,
  Student_CoursePack,
  Student_Lesson,
};
