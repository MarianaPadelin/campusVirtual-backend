import { Schema, model } from "mongoose";

const clasesSchema = new Schema({
  nombre: String,
  profesor: String,
  año: Number,
  faltas: Number,
  alumnos: [
    {
      type: Schema.Types.ObjectId,
      ref: "alumnos",
    },
  ],
  asistencias: [
    {
      type: Schema.Types.ObjectId,
      ref: "asistencias",
    },
  ],
  notas: [
    {
      type: Schema.Types.ObjectId,
      ref: "notas",
      // id: false
    },
  ],
  archivos: [
    {
      type: Schema.Types.ObjectId,
      ref: "material",
    },
  ],
});

//Instancio el modelo para conectarlo a la db.
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const clasesModel = model("clases", clasesSchema);

export { clasesModel };
