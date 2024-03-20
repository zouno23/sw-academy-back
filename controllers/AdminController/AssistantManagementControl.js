
const users = require("../../models/users");

const { TokenGenerator } = require("../../utils/tokengenerator");



const teachers = users.Teacher;
const Assistants = users.Assistant;

module.exports.addAssitant = async (req, res) => {
  try {
    const assistant = await Assistants.create(req.body);
    const token = TokenGenerator(assistant._id, assistant.Role);
    res.setHeader("jwt", token);
    assistant.save;
    return res.status(200).json({
      message: `successful account creation for ${assistant.FullName}`,
      Result: {
        userId: assistant._id,
        userRole: assistant.Role,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.DeleteAssistant = async (req, res) => {
 
  try{
    const { Email } = req.body;
    let assistant = await Assistants.findOne({ Email });
    if (!assistant) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    await assistant.deleteOne();
    return res.status(200).json({ message: 'Teacher deleted successfully' });

  }catch(err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  
};


module.exports.Upadate= async(req,res)=>{


  try{
    const { Email } = req.body;

    const user = await Assistants.findOne({ Email });
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
    return res.status(500).json({ message: "Internal server error" });
  }
}