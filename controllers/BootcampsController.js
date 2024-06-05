const { BootCamp, Student_BootCamp, Course } = require("../models/courses");
module.exports.getBootCamps = async (req, res) => {
  userId = res.locals.userId;
  userRole = res.locals.userRole;
  try {
    let Result = {};
    if (userRole === "Student") {
      const All = await BootCamp.find();
      const Owned = await Student_BootCamp.find({ Student: userId });
      Result = { All: All || [], Owned: Owned || [] };
    } else if (userRole === "Student") {
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
