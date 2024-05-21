const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Image");
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const ext = file.originalname.split(".")[1];
    cb(null, "ProfilePicture" + Date.now() + "." + ext);

    console.log("done1");
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };
