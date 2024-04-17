const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("../../models/users");

const { TokenGenerator } = require("../../utils/tokengenerator");



const teachers = users.Teacher;
const students = users.Student;

module.exports.addTeacher = async (req, res) => {
  try {
    const user = await teachers.create(req.body);
    // const token = TokenGenerator(student._id, student.Role);
    // res.setHeader("jwt", token);
    user.save;
    res.status(200).json({
      message: `successful account creation for ${user.FullName}`,
      Result: {
        userId: user._id,
        userRole: user.Role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports.DeleteTeacher = async (req, res) => {
 
//   try{
//     const { _id } = req.body;
//     let teacher = await teachers.findOne({ _id });
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     await teacher.deleteOne();
//     return res.status(200).json({ message: 'Teacher deleted successfully' });

//   }catch(err) {
//       console.log(err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
  
// };

module.exports.DeletePicture = async (req, res) => {
  try{
    const { _id } = req.body;
    const user = await users.Teacher.findOne({ _id });
    console.log(_id)
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.Picture = "";
      console.log("done")
      await user.save();
      return res.status(200).json({ message: `successful delete Picture` });
  }catch(e){   
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });}
}


module.exports.Upadate= async(req,res)=>{


  try{
    const { _id } = req.body;
    const user = await users.Teacher.findOne({ _id });
    console.log(_id)
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.FullName = req.body.FullName || user.FullName;
      user.Email=req.body.Email ||user.Email;     

      
      await user.save();
      return res.status(200).json({ message: `successful Update T` });
  }catch(e){
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });}
}

exports.getTeachers = async (req, res) => {
  try {
    const teacher = await teachers.find();
    console.log(teacher)
    const spacedTeachers = teacher.map(teacher => ({
       _id:teacher._id,
       Name: teacher.FullName,
       email: teacher.Email,
        numero: teacher.Numero || "5" ,
        Role:"Teacher",
        Courses: teacher.courses || '5' ,
        availability:teacher.availability|| "true",
        Status: teacher.status || false,
        
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

exports.toggleStatus = async (req, res) =>  {
  
  try{
    const { _id } = req.body;
    const user = await users.Teacher.findOne({ _id });
  
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
console.log("ddd")
     user.status = !user.status;
      
      await user.save();
      if (user.status)
      {return res.status(200).json({ message: `successful enable` });}
      if (!user.status)
      {return res.status(200).json({ message: `successful disabled ` });}
      
  }catch(e){
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });}
}
