import express from "express";
import mongoose from "mongoose";
// import { MONGO_URL } from "../config/env.js"

import alumnos_router from "../src/routes/alumnos.router.js";
import notas_router from "../src/routes/notas.router.js";
import { alumnosModel } from "../models/alumnos.model.js";
// import __dirname from "./utils.js";

import cors from "cors";

//Inicializo el servidor en express
const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

//Middleware para peticiones por POST y desde body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión con mongoose
mongoose
  //cambiar a url del .env
  .connect(
    "mongodb+srv://marianapadelin:test@clusterbackend.biiqs0l.mongodb.net/Campus?retryWrites=true&w=majority&appName=ClusterBackend"
  )
  .then(() => {
    console.log("DB conectada");
  })
  .catch((err) => console.log(err));

//Home
app.get("/", (req, res) => {
  res.json("Servidor conectado");
});

// const prueba = async () => {
//  const alumno = await alumnosModel.findById("67732f229842a0876f668859");
// alumno.notas.push("676d7e1eec0d3161e60c57c7");
// console.log(alumno);
// const update = await alumnosModel.findByIdAndUpdate(
//   { _id: alumno._id },
//   alumno
// );
// console.log(alumno);
// console.log(update);
// }

// prueba();
//node ./src/index.js

//Conexión con las rutas
app.use("/alumnos", alumnos_router);
app.use("/notas", notas_router);

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
