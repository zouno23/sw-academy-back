const Admin = require("../../models/Admin");
const { Teacher, Student } = require("../../models/users");
const {
  Course,
  Student_Course,
  Student_BootCamp,
  BootCamp,
} = require("../../models/courses");
const { RoleComparison } = require("../../utils/RoleComparison");
module.exports.GetNewestTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}, "FullName Email Date Picture")
      .sort({ Date: -1 })
      .limit(5);
    if (!teachers) {
      return res.status(404).json({ message: "No teachers found" });
    }
    return res.status(200).json({
      message: "Newest Teachers found successfully",
      Result: teachers,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetNewestStudents = async (req, res) => {
  try {
    const students = await Student.find({}, "FullName Email Date Picture")
      .sort({ Date: -1 })
      .limit(5);
    if (!students) {
      return res.status(404).json({ message: "No students found" });
    }
    return res.status(200).json({
      message: "Newest students found successfully",
      Result: students,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetNewestAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "Name Email Date Picture")
      .sort({ Date: -1 })
      .limit(5);
    if (!admins) {
      return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({
      message: "Newest admins found successfully",
      Result: admins,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetAllTeachers = async (req, res) => {
  try {
    let TeacherCourses = {};
    const teachers = await Teacher.find({}, "FullName Email Status Picture ");
    if (!teachers) {
      return res
        .status(404)
        .json({ message: "No Teachers Found in the DataBase" });
    }

    const courses = await Course.find({}, "IsLive Teacher");

    for (const course of courses) {
      if (!TeacherCourses[course.Teacher]) {
        TeacherCourses[course.Teacher] = { TotalCourses: 0, LiveCourses: 0 };
      }
      if (course.IsLive) {
        TeacherCourses[course.Teacher].LiveCourses += 1;
      }
      TeacherCourses[course.Teacher].TotalCourses += 1;
    }

    teachers.map((teacher, index) => {
      if (!TeacherCourses[teacher._id]) {
        teachers[index] = {
          Picture: teacher.Picture,
          _id: teacher._id,
          FullName: teacher.FullName,
          Status: teacher.Status,
          Email: teacher.Email,
          TotalCourses: 0,
          LiveCourses: 0,
        };
      } else {
        teachers[index] = {
          Picture: teacher.Picture,
          _id: teacher._id,
          FullName: teacher.FullName,
          Status: teacher.Status,
          Email: teacher.Email,
          TotalCourses: TeacherCourses[teacher._id].TotalCourses,
          LiveCourses: TeacherCourses[teacher._id].LiveCourses,
        };
      }
    });

    return res
      .status(200)
      .json({ message: "Teachers Found Successfully", Result: teachers });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetAllStudents = async (req, res) => {
  try {
    const students = await Student.find(
      {},
      "FullName Email Status Courses BootCamps Picture"
    );
    if (!students) {
      return res.status(404).json({ message: "No Students found" });
    }
    return res
      .status(200)
      .json({ message: "Students found successfully", Result: students });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      return res.status(404).json({ message: "no admins found" });
    }
    return res
      .status(200)
      .json({ message: "admins found successfully ", Result: admins });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.CreateTeacher = async (req, res) => {
  try {
    const { FullName, Email, Password } = await req.body;
    const teacher = await Teacher.create({
      FullName,
      Email,
      Password,
      Role: "Teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not created" });
    }
    return res.status(200).json({ message: "Teacher created successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.CreateStudent = async (req, res) => {
  try {
    const { FullName, Email, Password } = await req.body;
    const student = await Student.create({
      FullName,
      Email,
      Password,
      Role: "Student",
    });
    if (!student) {
      return res.status(404).json({ message: "Student not created" });
    }
    return res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.CreateAdmin = async (req, res) => {
  try {
    const role = res.locals.AdminRole;
    const { Name, Email, Password, Role } = await req.body;
    if (!RoleComparison(role, Role)) {
      return res.status(400).json({ message: "Role doesn't have access" });
    }
    const admin = await Admin.create({
      Name,
      Email,
      Password,
      Role,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not created" });
    }
    return res.status(200).json({ message: "Admin Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.query.TeacherId,
      "Picture  FullName Email Date Numero Status"
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res
      .status(200)
      .json({ message: "Teacher found successfully ", Result: teacher });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetTeacherCourses = async (req, res) => {
  try {
    const TeacherCourses = await Course.find({ Teacher: req.query.TeacherId });
    if (!TeacherCourses) {
      return res.status(404).json({ message: "Teacher courses not found" });
    }
    let result = [];
    for (const course of TeacherCourses) {
      const sellings = await Student_Course.find({ Course: course._id });
      result.push({
        Cover: course.Cover,
        Field: course.Field,
        IsLive: course.IsLive,
        Rating: course.Rating,
        Title: course.Title,
        Description: course.Description,
        _id: course._id,
        Buyers: sellings.length,
      });
    }
    return res.status(200).json({
      message: "Teacher Courses found successfully",
      Result: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
module.exports.GetTeacherCourseSellings = async (req, res) => {
  var CoursesPerMonth = {};
  try {
    const Courses = await Course.find({ Teacher: req.query.TeacherId });
    AllBoughtCourses = await Student_Course.find().populate("Course").exec();
    if (!AllBoughtCourses.length)
      return res.status(404).json({ message: "no courses found" });
    for (const item of AllBoughtCourses) {
      if (Courses.filter((value) => IsIdEqual(value, item.Course)).length > 0) {
        const DateBought = new Date(item.DateStarted);
        const month = DateBought.getMonth() + 1; //javascript months are zero based so we add 1 to get the correct
        const year = DateBought.getFullYear();
        CoursesPerMonth[year] = CoursesPerMonth[year] || {};
        CoursesPerMonth[year][month] = CoursesPerMonth[year][month] || 0;
        CoursesPerMonth[year][month]++;
      }
      return res.status(200).json({
        Message: "Successfully retrieved sold courses per month.",
        Details:
          "Response data will be an object with years as key it's value  is an object with month numbers as keys and the number of sold Courses as values as Result",
        Result: CoursesPerMonth,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.UpdateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.query.TeacherId);
    if (!teacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    teacher.FullName = req.body.FullName;
    teacher.Email = req.body.Email;
    teacher.Status = req.body.Status;
    await teacher.save();
    return res.status(200).json({
      message: "Teacher updated successfully",
      Result: {
        FullName: teacher.FullName,
        Date: teacher.Date,
        Picture: teacher.Picture,
        Email: teacher.Email,
        Status: teacher.Status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetStudent = async (req, res) => {
  try {
    const student = await Student.findById(
      req.query.StudentId,
      "Picture  FullName Email Date Numero Status"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res
      .status(200)
      .json({ message: "Student found successfully ", Result: student });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetStudentCourses = async (req, res) => {
  try {
    const StudentCourses = await Student_Course.find({
      Student: req.query.StudentId,
    }).populate("Course");
    if (!StudentCourses) {
      return res.status(404).json({ message: "Student courses not found" });
    }
    return res.status(200).json({
      message: "Student Courses found successfully",
      Result: StudentCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.GetStudentCompletedCourses = async (req, res) => {
  try {
    const StudentCourses = await Student_Course.find({
      Student: req.query.StudentId,
      Progress: 100,
    }).populate("Course");
    if (!StudentCourses) {
      return res.status(404).json({ message: "Student courses not found" });
    }
    return res.status(200).json({
      message: "Student Courses found successfully",
      Result: StudentCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports.UpdateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.query.StudentId);
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }
    student.FullName = req.body.FullName;
    student.Email = req.body.Email;
    student.Status = req.body.Status;
    await student.save();
    return res.status(200).json({
      message: "student updated successfully",
      Result: {
        FullName: student.FullName,
        Date: student.Date,
        Picture: student.Picture,
        Email: student.Email,
        Status: student.Status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.AddStudentCourse = async (req, res) => {
  try {
    const { StudentId, ProductId, type } = req.body;
    let Course;
    if (type === "Course") {
      Course = await Student_Course.create({
        Student: StudentId,
        Course: ProductId,
      });
    } else if (type === "Course") {
      Course = await Student_BootCamp.create({
        Student: StudentId,
        BootCamp: ProductId,
      });
    }
    if (!Course) {
      return res.status(400).json({ message: "error adding the course" });
    }
    return res.status(200).json({ message: "course added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.GetAllCourses = async (req, res) => {
  try {
    const Courses = await Course.find({ IsLive: false });
    return res
      .status(200)
      .json({ message: "courses found successfully", Result: Courses });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.GetAllBootcamps = async (req, res) => {
  try {
    const Bootcamp = await BootCamp.find({ IsLive: false });
    return res
      .status(200)
      .json({ message: "Bootcamp found successfully", Result: Bootcamp });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
