const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const certifSchema = new Schema({
  Title: { type: String },
  Student: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Student" } },
});

const lessonCertifSchema = new Schema({
  Teacher: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" } },
  Lesson: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" } },
});

const courseCertifSchema = new Schema({
  Teachers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  },
  Course: {
    type: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } },
  },
});

const Certificate = mongoose.model("Certificate", certifSchema);
const LessonCertificate = Certificate.discriminator(
  "LessonCertificate",
  lessonCertifSchema
);
const CourseCertificate = Certificate.discriminator(
  "CourseCertificate",
  courseCertifSchema
);

module.exports = { CourseCertificate, LessonCertificate };
