import { Schema, model } from "mongoose";

const asistenciasSchema = new Schema({
  fecha: date,
  presente: boolean,
  id_clase: { type: Schema.Types.ObjectId, ref: "clases" },
  id_alumno: { type: Schema.Types.ObjectId },
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const asistenciasModel = model("asistencias", asistenciasSchema);

export { asistenciasModel };
