const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("../../models/users");

const { TokenGenerator } = require("../../utils/tokengenerator");



const teachers = users.Teacher;
const students = users.Student;

module.exports.addTeacher = async (req, res) => {
  try {
    const teacher = await teachers.create(req.body);
    const token = TokenGenerator(teacher._id, teacher.Role);
    res.setHeader("jwt", token);
    teacher.save;
    res.status(200).json({
      message: `successful account creation for ${teacher.FullName}`,
      Result: {
        userId: teacher._id,
        userRole: teacher.Role,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.DeleteTeacher = async (req, res) => {
 
  try{
    const { Email } = req.body;
    let teacher = await teachers.findOne({ Email });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    await teacher.deleteOne();
    return res.status(200).json({ message: 'Teacher deleted successfully' });

  }catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  
};


module.exports.Upadate= async(req,res)=>{


  try{
    const { Email } = req.body;

    const user = await users.Teacher.findOne({ Email });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.FullName = req.body.FullName || user.FullName;
          

      if (req.body.password) {
        user.Password = req.body.password;
      }
      await user.save();
      return res.status(200).json({ message: `successful Update T` });
  }catch(e){
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });}
}

exports.getTeachers = async (req, res) => {
  try {
    const teacher = await students.find();
    const spacedTeachers = teacher.map(teacher => ({
      teacherName: teacher.FullName,
      email: teacher.email,
        numero: teacher.numero,
        Courses: teacher.courses || '5' ,
        availability:teacher.availability|| "true",
        Status: teacher.status || true,
        
      }));
    console.log(spacedTeachers)

    res.status(200).json({
      message: "user found successfully",
      deatils: "Response data will be a list of teachers each one has a FullName,Email, ID & Picture as Result",
      teacherCount: teacher.length ,
      Result:spacedTeachers});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error"});
  }
};
// // Supposons que l'objet teacher a les attributs teacherName, email, number, courses, et status
// const spacedTeachers = teacher.map(teacher => ({
//   FullName: teacher.teacherName,
//   Email: teacher.email,
//   ID: teacher.number,
//   Courses: teacher.courses,
//   Status: teacher.status
// }));

// // Ensuite, renvoyez cette liste d'enseignants espacés dans votre réponse JSON
// res.status(200).json({
//   message: "user found successfully",
//   details: "Response data will be a list of teachers each one has a FullName, Email, ID & Picture as Result",
//   teacherCount: spacedTeachers.length,
//   Result: spacedTeachers
// });
