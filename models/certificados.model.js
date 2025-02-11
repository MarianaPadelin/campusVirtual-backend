import { Schema, model } from "mongoose";

const certificadoSchema = new Schema({
  nombre: String,
  fecha: String,
  id_alumno: { type: Schema.Types.ObjectId, ref: "alumnos" },
  año: Number,
  url: String
});

const certificadoModel = model("certificados", certificadoSchema);

export { certificadoModel };
