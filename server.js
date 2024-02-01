const express = require("express");
const mongoose = require("mongoose");
const authroutes = require("./routers/routes");

const app = express();
const dbURI = "mongodb://localhost:27017/sw-academy";

mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err, "supp"));

app.use(express.json());
app.use(authroutes);
