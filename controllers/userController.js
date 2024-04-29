const users = require("../models/users");

module.exports.UpdateUser = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    console.log(req.body);
    // Rechercher l'utilisateur spécifique en utilisant son ID et son rôle
    if (userRole === "Student") {
      const user = await users.Student.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.FullName = req.body.FullName || user.FullName;
      user.email = req.body.email || user.email;
      // user.about = req.body.about || user.about;
      if (req.body.password) {
        user.Password = req.body.password;
      }
      await user.save();
      return res.status(200).json({ message: `successful Update S` });
    }

    if (userRole === "teacher") {
      const user = await users.Teacher.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.FullName = req.body.FullName || user.FullName;
      user.email = req.body.email || user.email;
      // user.about = req.body.about || user.about;

      if (req.body.password) {
        user.Password = req.body.password;
      }
      await user.save();
      return res.status(200).json({ message: `successful Update T` });
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
    console.log(err);
  }
};
module.exports.UpdateUserImage = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;

    // Rechercher l'utilisateur spécifique en utilisant son ID et son rôle
    if (userRole === "Student") {
      const user = await users.Student.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      user.Picture = req.file.path || user.Picture;
      await user.save();
      return res.status(200).json({ message: "sucessful" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};
