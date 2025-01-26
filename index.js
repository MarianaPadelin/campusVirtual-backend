import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import passport from "passport";
import inicializePassport from "./src/config/passport_config.js"; //
// import { MONGO_URL } from "../config/env.js"

import alumnos_router from "./src/routes/alumnos.router.js";
import notas_router from "./src/routes/notas.router.js";
import clases_router from "./src/routes/clases.router.js";
import pagos_router from "./src/routes/pagos.router.js";
import asistencias_router from "./src/routes/asistencias.router.js";
import material_router from "./src/routes/material.router.js";
import session_router from "./src/routes/sesiones.router.js";
import alumno_router from "./src/routes/alumno_router.js"
// import __dirname from "./utils.js";
import session from "express-session";
import cookieParser from "cookie-parser";

import cors from "cors";

//Inicializo el servidor en express
const app = express();
const PORT = 3000;
const MONGO_URL =
  "mongodb+srv://marianapadelin:test@clusterbackend.biiqs0l.mongodb.net/Campus?retryWrites=true&w=majority&appName=ClusterBackend";
const secret = "campusSeCret";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    // origin: "https://campus-virtual-frontend.vercel.app",

    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

//Middleware para peticiones por POST y desde body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuración se sesión
app.use(
  session({
    //almaceno los datos de sesión en mongo atlas
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      // mongoOptions:{ useNewUrlParser: true, useUnifiedTopology: true},
      ttl: 2 * 60, //la sesión dura 2 min
    }),
    secret: secret,
    resave: false,
    //resave mantiene la sesión guardada en memoria del servidor aunque haya tiempo de inactividad, no hace falta si estoy guardando en mongo
    saveUninitialized: true,
    //guarda la sesión aún cuando no el objeto "sesión" esté vacío
  })
);

// Conexión con mongoose

const connectMongoDB = async () => {
  try {
    mongoose.connect(MONGO_URL);
    console.log("DB conectada");
  } catch (err) {
    console.error("No se pudo conectar a la DB" + err);
    process.exit();
  }
};

connectMongoDB();

//Home
app.get("/", (req, res) => {
  res.json("Servidor conectado");
});

//node ./src/index.js

//middleware para chequear url:
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });
inicializePassport(); // Initialize Passport strategies
app.use(passport.initialize()); // Attach Passport middleware
app.use(cookieParser());

app.use(express.static("/public"));
//Conexión con las rutas

app.use("/session", session_router);
app.use("/alumnos", alumnos_router);
//admin
app.use("/clases", clases_router);
app.use("/notas", notas_router);
app.use("/pagos", pagos_router);
app.use("/asistencias", asistencias_router);
app.use("/material", material_router);

// alumnos
app.use("/alumno", alumno_router)

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
