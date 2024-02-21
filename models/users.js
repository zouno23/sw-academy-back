const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  FullName: { type: String, required: true },
  Email: { type: String, required: true, trim: true, unique: true },
  Role: {
    type: String,
    required: true,
    enum: ["SuperAdmin", "Admin", "Assistant", "Teacher", "Student"],
    default: "Student",
  },
  Password: { type: String, required: true },
  GoogleId: { type: String, default: null },
  code: { type: String },
});
userSchema.index({ code: 1 }, { expireAfterSeconds: 3600 });

const studentSchema = new Schema({
  ...userSchema.obj,
  StudentId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return generateId();
    },
  },
});

studentSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const teacherSchema = new Schema({
  ...userSchema.obj,
  TeacherId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return generateId();
    },
  },
});

teacherSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);

function generateId() {
  const timestamp = new Date().getTime().toString(16);

  const random = Math.random().toString(16).substr(2, 6);

  const id = timestamp + random;

  return id;
}

module.exports = { Teacher, Student };
