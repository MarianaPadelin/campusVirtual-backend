import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  //encriptar
  password: String,
  role: { type: String, default: "alumno", enum: ["alumno", "admin"] },
});

const userModel = model("users", userSchema);

export { userModel };
