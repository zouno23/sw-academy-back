const users = require("../models/users");

module.exports.UpdateUser = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const userRole = res.locals.userRole;
    // Rechercher l'utilisateur spécifique en utilisant son ID et son rôle
    const user = await users.User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.FullName = req.body.FullName || user.FullName;
    user.Email = req.body.email || user.Email;
    // user.about = req.body.about || user.about;
    if (req.body.password) {
      user.Password = req.body.password;
    }
    await user.save();
    return res.status(200).json({ message: `successful Update S` });
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
    const user = await users.User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.Picture = req.file.path || user.Picture;
    await user.save();
    return res.status(200).json({ message: "sucessful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};
