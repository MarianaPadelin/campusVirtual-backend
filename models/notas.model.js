import { Schema, model } from "mongoose";

const notasSchema = new Schema({
  id_clase: { type: Schema.Types.ObjectId },
  id_alumno: { type: Schema.Types.ObjectId },
  nota: Number,
  mes: {
    type: String,
    enum: ["julio", "diciembre"]
  },
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const notasModel = model("notas", notasSchema);

export { notasModel };
