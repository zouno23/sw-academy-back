// const { Router } = require("express");
// const router = new Router();
// const { Lesson, Student_Lesson } = require("../models/courses");

// router.post("/test/createLesson", async (req, res) => {
//   let lesson = req.body;
//   if (!lesson.Title || !lesson.Description) {
//     return res.status(400).json({ error: "Missing fields!" });
//   } else {
//     const newLesson = await Lesson.create(lesson);
//     console.log("success");
//     newLesson.save();
//     res.status(200).json("successful lesson creation");
//   }
// });

// router.post("/test/createRelation", async (req, res) => {
//   let slesson = [];
//   slesson = req.body;
//   slesson.map(async (index) => {
//     const lessontest = await Lesson.findOne({ IsLive: true });
//     index.Student = "65d89ced0b449e16ef9da0b1";
//     index.Lesson = lessontest._id;
//     console.log(index._id);
//     const newsLesson = await Student_Lesson.create(index);
//     console.log("success");
//     newsLesson.save();
//   });
//   res.status(200).json("successful relation creation");
// });

// module.exports = router;
