const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const certifSchema = new Schema({
  Title: { type: String },
  Student: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Student" } },
});

const courseCertifSchema = new Schema({
  Teacher: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" } },
  Course: { type: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } },
});

const BootCampCertifSchema = new Schema({
  Teachers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  },
  BootCamp: {
    type: { type: { type: mongoose.Schema.Types.ObjectId, ref: "BootCamp" } },
  },
});

const Certificate = mongoose.model("Certificate", certifSchema);
const CourseCertificate = Certificate.discriminator(
  "CourseCertificate",
  courseCertifSchema
);
const BootCampCertificate = Certificate.discriminator(
  "BootCampCertificate",
  BootCampCertifSchema
);

module.exports = { CourseCertificate, BootCampCertificate };
