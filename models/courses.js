const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Field: { type: String, required: true },
  RequiredLevel: { type: String, required: true },
  TimeRange: { type: String },
  IsLive: { type: Boolean },
  IsPublished: { type: Boolean },
  CoursePack: { type: mongoose.Schema.Types.ObjectId, ref: "CoursePack" },
  Teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

const coursePackSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  Field: { type: String, required: true },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const bootCampSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String },
  TimeRange: { type: String },
  Field: { type: String },
  CoursePacks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoursePack" }],
  },
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
});

const Course = mongoose.model("Lesson", courseSchema);
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
};
