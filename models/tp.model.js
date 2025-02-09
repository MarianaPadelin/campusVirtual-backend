import { Schema, model } from "mongoose";

const tpSchema = new Schema({
  nombre: String,
  fecha: String,
  url: String,
  clase: String,
  idAlumno: String,
});

const tpModel = model("tps", tpSchema);

export { tpModel };
