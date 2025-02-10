import { Schema, model } from "mongoose";

const pagosSchema = new Schema({
  id_alumno: { type: Schema.Types.ObjectId, ref: "alumnos" },
  fecha: String,
  monto: Number
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const pagosModel = model("pagos", pagosSchema);

export { pagosModel };
