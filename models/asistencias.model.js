import { Schema, model } from "mongoose";

const asistenciasSchema = new Schema({
  clase: String,
  fecha: String,
  id_alumno: { type: Schema.Types.ObjectId, ref: "alumnos" },
  asistencia: Boolean,
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const asistenciasModel = model("asistencias", asistenciasSchema);

export { asistenciasModel };
