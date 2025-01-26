import { Schema, model } from "mongoose";

const notasSchema = new Schema({
  clase: String,
  año: Number, 
  id_alumno: { type: Schema.Types.ObjectId },
  notaJulio: Number,
  notaDiciembre: Number
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const notasModel = model("notas", notasSchema);

export { notasModel };
