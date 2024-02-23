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
  Teacher: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
  },
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

const Lesson = mongoose.model("Lesson", lessonSchema);
const Course = mongoose.model("Course", courseSchema);
const CoursePack = mongoose.model("CoursePack", coursePackSchema);

module.exports = { Lesson, Course, CoursePack };
