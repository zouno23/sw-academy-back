const Admin = require("../../models/Admin");
const { Course } = require("../../models/courses");
const Users = require("../../models/users");
const moment = require("moment");
const { Student_Course } = require("../../models/courses");

const Teacher = Users.Teacher;
const Student = Users.Student;
const User = Users.User;
module.exports.getNumberOfUsers = async (req, res) => {
  const id = res.locals.AdminId;
  const role = res.locals.AdminRole;
  try {
    const students = await Student.find();
    const teachers = await Teacher.find();
    const admins = await Admin.find();
    res.status(200).json({
      message: "users found successfully",
      Result: {
        students: students.length,
        teachers: teachers.length,
        admins: admins.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.getCoursesNumbers = async (req, res) => {
  const id = res.locals.AdminId;
  const role = res.locals.AdminRole;
  try {
    const TotalCourses = await Course.find();
    const LiveCourses = TotalCourses.filter((course) => course.IsLive === true);

    res.status(200).json({
      message: "Courses Found successfully",
      Result: {
        LiveCourses: LiveCourses.length,
        TotalCourses: TotalCourses.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetAllSoldCoursesPerMonth = async (req, res) => {
  var CoursesPerMonth = {};
  try {
    AllBoughtCourses = await Student_Course.find().populate("Course").exec();
    if (!AllBoughtCourses.length)
      return res.status(404).json({ message: "no courses found" });
    const thisYear = Date.now().getFullYear();
    const lastYear = thisYear - 1;
    for (const item of AllBoughtCourses) {
      const DateBought = new Date(item.DateStarted);
      const month = DateBought.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
      const year = DateBought.getFullYear();
      if (year >= lastYear) {
        CoursesPerMonth[year] = CoursesPerMonth[year] || {};
        CoursesPerMonth[year][month] = CoursesPerMonth[year][month] || 0;
        CoursesPerMonth[year][month]++;
      }
    }

    return res.status(200).json({
      Message: "Successfully retrieved sold courses per month.",
      Details:
        "Response data will be an object with years as key it's value  is an object with month numbers as keys and the number of sold Courses as values as Result",
      Result: CoursesPerMonth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetLatestCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses) {
      return res.status(404).json({ message: "No courses found" });
    }
    sortedCourses = courses.sort((a, b) => -moment(a?.Date).diff(moment(b)));
    let i = 0;
    let MostRecentCourses = [];
    for (const item of sortedCourses) {
      if (i >= 5) break;
      MostRecentCourses.push(item);
      i += 1;
    }
    return res.status(200).json({
      message: "Courses Found successfully",
      Result: MostRecentCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetMostActiveTeachers = async (req, res) => {
  try {
    let TeacherPublishings = {};
    const teachers = await Teacher.find();
    const limitDate = moment(Date.now()).subtract(1, "months");
    const coursesPublishedThisMonth = await Course.find({
      Date: { $gt: limitDate },
    });
    const courseBoughtThisMonth = await Student_Course.find({
      DateStarted: { $gt: limitDate },
    });
    if (!teachers) {
      return res.status(404).json({ message: "No teachers found" });
    }
    if (!coursesPublishedThisMonth && !courseBoughtThisMonth) {
      return res
        .status(404)
        .json({ message: "No Courses published or bought this month" });
    }

    for (const item of coursesPublishedThisMonth) {
      if (!TeacherPublishings[item?.Teacher]) {
        TeacherPublishings[item?.Teacher] = 0;
      }
      TeacherPublishings[item.Teacher] += 1;
    }
    for (const item of courseBoughtThisMonth) {
      if (!TeacherPublishings[item?.Teacher]) {
        TeacherPublishings[item?.Teacher] = 0;
      }
      TeacherPublishings[item.Teacher] += 1;
    }
    let Best = [];
    let i = 0;
    while (i < 5) {
      let max = 0;
      let maxTeacher;
      for (const item of teachers) {
        if (
          TeacherPublishings[item._id] &&
          TeacherPublishings[item._id] > max
        ) {
          max = TeacherPublishings[item._id];
          maxTeacher = item;
        }
      }
      if (!maxTeacher) break;
      Best.push({
        FullName: maxTeacher.FullName,
        Email: maxTeacher.Email,
        _id: maxTeacher._id,
        Picture: maxTeacher.Picture,
        Numbers: max,
      });
      i += 1;
      TeacherPublishings[maxTeacher._id] = 0;
    }
    res
      .status(200)
      .json({ message: "Best Teachers found successfully", Result: Best });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetMostActiveStudents = async (req, res) => {
  try {
    const limitDate = moment(Date.now()).subtract(1, "months");
    const students = await Student.find();
    const coursesToCount = await Student_Course.find({
      $or: [
        { DateStarted: { $gt: limitDate } },
        { DateCompleted: { $gt: limitDate } },
      ],
    });
    if (!students) {
      return res.status(404).json({ message: "no students found" });
    }
    if (!coursesToCount) {
      return res
        .status(402)
        .josn({ message: "no courses bought or completed this month" });
    }
    let StudentAccomplishments = {};
    for (const item of coursesToCount) {
      if (!StudentAccomplishments[item.Student]) {
        StudentAccomplishments[item.Student] = 0;
      }
      StudentAccomplishments[item.Student] += 1;
    }

    let Best = [];
    let i = 0;
    while (i < 5) {
      let max = 0;
      let maxStudent;
      for (const item of students) {
        if (
          StudentAccomplishments[item._id] &&
          StudentAccomplishments[item._id] > max
        ) {
          max = StudentAccomplishments[item._id];
          maxStudent = item;
        }
      }
      if (!maxStudent) break;
      Best.push({
        FullName: maxStudent.FullName,
        Email: maxStudent.Email,
        _id: maxStudent._id,
        Picture: maxStudent.Picture,
        Numbers: max,
      });
      i += 1;
      StudentAccomplishments[maxStudent._id] = 0;
    }
    return res
      .status(200)
      .json({ message: "students found successfullt", Result: Best });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
