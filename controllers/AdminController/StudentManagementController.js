const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("../../models/users");

const { TokenGenerator } = require("../../utils/tokengenerator");



const students = users.Student;

module.exports.addStudent = async (req, res) => {
  try {
    const teacher = await students.create(req.body);
    const token = TokenGenerator(teacher._id, teacher.Role);
    // res.setHeader("jwt", token);
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


// module.exports.DeleteTeacher = async (req, res) => {
 
//   try{
//     const { _id } = req.body;
//     let teacher = await students.findOne({ _id });
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
    const user = await users.Student.findOne({ _id });
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
    const user = await users.Student.findOne({ _id });
    console.log(_id)
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.FullName = req.body.FullName || user.FullName;
      user.Email=req.body.Email ||user.Email; 
    //   user.Numero=req.body.Numero ||user.Numero;     


      
      await user.save();
      return res.status(200).json({ message: `successful Update T` });
  }catch(e){
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });}
}

exports.getStudents = async (req, res) => {
  try {
    const student = await students.find();
    const spacedStudent = student.map(teacher => ({
      _id:student._id,
      teacherName: student.FullName,
      email: student.Email,
        numero: student.Numero || "5" ,
        Courses: student.courses || '5' ,
        Role:"Teacher",
        
        // availability:student.availability|| "true",
        Status: student.status || false,
        
      }));
    console.log(spacedStudent)

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
    const user = await users.Student.findOne({ _id });
  
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
