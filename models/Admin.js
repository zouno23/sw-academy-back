const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, trim: true, unique: true },
  Role: {
    type: String,
    required: true,
    enum: ["Assistant", "Admin", "SuperAdmin"],
    default: "Assisstant",
  },
  Picture: { type: String },
  Numero: { type: String },
  Password: { type: String, required: true },
  status: { type: Boolean, default: true },
});
AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
