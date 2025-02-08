import { Schema, model } from "mongoose";

const alumnosSchema = new Schema({
  nombre: String,
  apellido: String,
  email: {
    type: String,
    unique: true,
    require: true,
  },
  celular: Number,
  //campo que referencia a la colección de asistencias
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
  pagos: [
    {
      type: Schema.Types.ObjectId,
      ref: "pagos",
      // id: false
    },
  ],
});


//Populate de las notas con un middleware
// alumnosSchema.pre('find', function() {
//     this.populate('notas');
// })



//Instancio el modelo para conectarlo a la db. 
// El primer parámetro es el nombre de la colección dentro de la db y el segundo es el esquema.
const alumnosModel = model("alumnos", alumnosSchema);

export { alumnosModel };