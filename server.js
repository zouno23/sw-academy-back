const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const corsSetup = require("./middlewares/CorsSetup");
const authroutes = require("./routers/authroutes");

const corsOptions = {
  origin: "http://localhost:3000",
};

const app = express();
app.use(cookieparser());
app.use(cors(corsOptions));
app.use(corsSetup);
const dbURI = "mongodb://localhost:27017/sw-academy";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(9000);
    console.log("listning on port 9000");
  })
  .catch((err) => console.log(err, "supp"));

app.use(express.json());
app.use(authroutes);
