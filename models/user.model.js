import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  //encriptar
  password: String
});


const userModel = model("users", userSchema);

export { userModel };
