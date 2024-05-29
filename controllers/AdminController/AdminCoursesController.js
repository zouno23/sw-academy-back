const { Course, BootCamp, Student_BootCamp } = require("../../models/courses");

module.exports.GetCoursesSample = async (req, res) => {
  try {
    const Sample = await Course.find({}).limit(5);
    if (!Sample) {
      return res.status(404).json({ message: "No Courses found" });
    }
    res
      .status(200)
      .json({ message: "Courses Sample found successfully", Result: Sample });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.GetBootcampsSample = async (req, res) => {
  try {
    const Sample = await BootCamp.find({}).limit(5);
    if (!Sample) {
      return res.status(404).json({ message: "No BootCamps found" });
    }
    let result = [];
    for (const camp of Sample) {
      const Bought = await Student_BootCamp.find({ BootCamp: camp._id });
      result.push({
        Title: camp.Title,
        _id: camp._id,
        Description: camp.Description,
        Field: camp.Field,
        Enrollements: Bought.length,
      });
    }
    res
      .status(200)
      .json({ message: "Bootcamps Sample found successfully", Result: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
