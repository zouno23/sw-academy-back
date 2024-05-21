const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const corsSetup = require("./middlewares/CorsSetup");
const setCache = require("./middlewares/Caching");
const authroutes = require("./routers/authroutes");
const userRoutes = require("./routers/userRoutes");
const TeacherManagementRoute = require("./routers/AdminRoutes/TeacherManagementRoute");
const MeetingRoute = require("./routers/MeetingRoute");
const DashboardRoutes = require("./routers/DashboardRoutes");
const CourseRoutes = require("./routers/CourseRoutes");
const QuizRoutes = require("./routers/QuizRoutes");


const path = require("path");
const app = express();
const server = require("http").createServer(app);
const initializeSocket = require("./utils/Socket");
const AdminAuthRoute = require("./routers/AdminRoutes/AdminAuthRoute");
// const TestRoutes = require("./routers/TestRoutes");

const corsOptions = {
  origin: "http://localhost:3000",
};

//middlewares
app.use(cookieparser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(corsSetup);
app.use(setCache);

const dbURI = "mongodb://localhost:27017/sw-academy";
app.use("/Image", express.static(path.join(__dirname, "/Image")));
app.use("/Files", express.static(path.join(__dirname, "/Files")));

const io = initializeSocket(server);

mongoose
  .connect(dbURI)
  .then((result) => {
    server.listen(9000);
    console.log("listning on port 9000");
  })
  .catch((err) => console.log(err));

app.use(express.json());

//routes
app.use(authroutes);
app.use(userRoutes);
app.use(DashboardRoutes);
app.use(CourseRoutes);
app.use(TeacherManagementRoute);

app.use(MeetingRoute);

// app.use(TestRoutes);
// Admin Routes

app.use(AdminAuthRoute);
