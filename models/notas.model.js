import { Schema, model } from "mongoose";

const notasSchema = new Schema({
  curso: String,
  profesor: String,
  nota: Number, 
  //mes
});

//Instancio el momdelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const notasModel = model("notas", notasSchema);

export { notasModel };
