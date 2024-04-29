const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path =
      "Files/" +
      "Courses/" +
      req.headers.coursetitle +
      "/" +
      req.headers.lessontitle;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const ext = file.originalname.split(".")[1];
    cb(
      null,
      req.headers.coursetitle +
        "_" +
        req.headers.lessontitle +
        Date.now() +
        "." +
        ext
    );
  },
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "Files/" + "Courses/" + req.headers.coursetitle + "/";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    const ext = file.originalname.split(".")[1];
    cb(null, req.headers.coursetitle + Date.now() + "." + ext);
  },
});
const uploadImage = multer({ storage: storage1 });
const uploadFile = multer({ storage: storage });

module.exports = { uploadFile, uploadImage };
