const mongoose = require("mongoose");

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
  Length: { type: Number }, // in minutes
});

const courseSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Cover: { type: String },
  Field: { type: String, required: true },
  RequiredLevel: { type: String, required: true },
  TimeRange: { type: String },
  IsLive: { type: Boolean },
  IsPublished: { type: Boolean },
  Rating: { type: Number, min: 0, max: 5, default: null },
  NumOfRatings: { type: Number, default: 0 },
  Teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  Price: { type: Number },
  Sellings: { type: Number, default: 0 },
  Lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  CoursePack: { type: mongoose.Schema.Types.ObjectId, ref: "CoursePack" },
});

const coursePackSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Field: { type: String, required: true },
  BootCamp: { type: mongoose.Schema.Types.ObjectId, ref: "BootCamp" },
});

const bootCampSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  TimeRange: { type: String },
  Field: { type: String },
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
const Stream = mongoose.model("Stream", streamSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Course = mongoose.model("Course", courseSchema);
const CoursePack = mongoose.model("CoursePack", coursePackSchema);
const BootCamp = mongoose.model("BootCamp", bootCampSchema);
const Student_Course = mongoose.model("Student_Course", StudentCourseSchema);
const Student_BootCamp = mongoose.model(
  "Student_BootCamp",
  StudentBootCampSchema
);

module.exports = {
  BootCamp,
  Course,
  CoursePack,
  Student_Course,
  Student_BootCamp,
  Stream,
  Lesson,
};
