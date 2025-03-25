import { Schema, model } from "mongoose";

const tpSchema = new Schema({
  nombre: String,
  fecha: String,
  url: String,
  clase: String,
  idAlumno: { type: Schema.Types.ObjectId, ref: "alumnos" },
  año: Number
});

const tpModel = model("tps", tpSchema);

export { tpModel };
