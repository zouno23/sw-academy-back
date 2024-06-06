const { BootCamp, Student_BootCamp, Course } = require("../models/courses");
const { Student } = require("../models/users");
module.exports.getBootCamps = async (req, res) => {
  const userId = res.locals.userId;
  const userRole = res.locals.userRole;
  try {
    let Result = {};
    if (userRole === "Student") {
      const All = await BootCamp.find();
      const Owned = await Student_BootCamp.find({ Student: userId }).populate(
        "BootCamp"
      );
      Result = { All: All || [], Owned: Owned || [] };
    } else if (userRole === "Teacher") {
      const Owned = await Course.find({ Teacher: userId }).populate("BootCamp");
      Result = { Owned: Owned || [] };
    } else {
      return res.status(400).json({ message: "Error Happened" });
    }
    return res
      .status(200)
      .json({ message: "Successfull getting bootcamps", Result });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetCamp = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    const CampId = req.query.CampId;
    let Result;
    const Camp = await BootCamp.findById(CampId);
    if (!Camp) return res.status(404).json({ message: "Camp not Found" });
    Result = Camp.toJSON();
    if (userRole === "Student") {
      const studentCamp = await Student_BootCamp.find({
        BootCamp: CampId,
        Student: userId,
      });
      const Courses = await Course.find({ BootCamp: CampId }).populate({
        path: "Lessons",
        populate: "Streams",
      });
      if (studentCamp.length === 1) {
        Result = {
          ...Result,
          Progress: studentCamp[0].Progress,
          DateStarted: studentCamp[0].DateStarted,
          IsCompleted: studentCamp[0].IsCompleted,
          DateCompleted: studentCamp[0].DateCompleted || null,
          StudentRating: studentCamp[0].Rating,
          Courses: Courses || [],
        };
      }

      Result = { NumCourses: Courses.length, ...Result };
    }
    return res.status(200).json({ message: "camp found successfuly", Result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.RatingCamp = async (req, res) => {
  try {
    const userId = res.locals.userId;
    console.log("hey");
    const userRole = res.locals.userRole;
    const CampId = req.query.CampId;
    if (userRole != "Student") {
      return res
        .status(404)
        .json({ message: "user has no access to rate this camp" });
    }
    const studentCamp = await Student_BootCamp.findOne({
      BootCamp: CampId,
      Student: userId,
    }).populate("BootCamp");
    if (!studentCamp) {
      return res
        .status(404)
        .json({ message: "student has no access to rate this camp" });
    }
    if (!studentCamp.Rating) {
      studentCamp.BootCamp.Rating =
        (studentCamp.BootCamp.Rating * studentCamp.BootCamp.NumOfRatings +
          req.body.Rating) /
        (studentCamp.BootCamp.NumOfRatings + 1);
      studentCamp.BootCamp.NumOfRatings += 1;
      studentCamp.BootCamp.save();
    } else {
      studentCamp.BootCamp.Rating =
        (studentCamp.BootCamp.Rating * studentCamp.BootCamp.NumOfRatings -
          studentCamp.Rating +
          req.body.Rating) /
        studentCamp.BootCamp.NumOfRatings;
      studentCamp.BootCamp.save();
    }
    studentCamp.Rating = req.body.Rating;
    studentCamp.save();
    return res.status(200).json({ message: "successfull rating" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
