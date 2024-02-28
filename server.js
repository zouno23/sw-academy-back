const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const corsSetup = require("./middlewares/CorsSetup");
const setCache = require("./middlewares/Caching");
const authroutes = require("./routers/authroutes");
const userRoutes = require("./routers/userRoutes");

const DashboardRoutes = require("./routers/DashboardRoutes");
const TestRoutes = require("./routers/TestRoutes");

const corsOptions = {
  origin: "http://localhost:3000",
};

const app = express();

//middlewares
app.use(cookieparser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(corsSetup);
app.use(setCache);

const dbURI = "mongodb://localhost:27017/sw-academy";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(9000);
    console.log("listning on port 9000");
  })
  .catch((err) => console.log(err));

app.use(express.json());

//routes
app.use(authroutes);
app.use(userRoutes);

app.use(DashboardRoutes);
app.use(TestRoutes);
