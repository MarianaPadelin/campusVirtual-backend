import { Schema, model } from "mongoose";

const materialSchema = new Schema({
    nombre: String,
    fecha: String,
    url: String,
    clase: String,
    año: Number,
})

const materialModel = model("material", materialSchema);

export { materialModel };