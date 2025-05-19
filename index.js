import config from "./src/config/config.js";

import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// import passport from "passport";
// import inicializePassport from "./src/config/passport_config.js"; //
// import { MONGO_URL } from "../config/env.js"

import alumnos_router from "./src/routes/alumnos.router.js";
import notas_router from "./src/routes/notas.router.js";
import clases_router from "./src/routes/clases.router.js";
import pagos_router from "./src/routes/pagos.router.js";
import asistencias_router from "./src/routes/asistencias.router.js";
import material_router from "./src/routes/material.router.js";
import session_router from "./src/routes/sesiones.router.js";
import user_router from "./src/routes/user.router.js";
import email_router from "./src/routes/email.router.js";
import tp_router from "./src/routes/tp.router.js"
// import __dirname from "./utils.js";

import session from "express-session";
import cookieParser from "cookie-parser";

import cors from "cors";

//Inicializo el servidor en express
const app = express();
const PORT = config.port;
const MONGO_URL = config.mongoUrl
const secret = "campusSeCret";



//CORS
app.use(
  cors({
    credentials: true,
    origin: config.rootUrl,
    // allowedHeaders: ["Content-Type", "Authorization"],

    methods: ["POST", "GET", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  })
);


//Middleware para peticiones por POST y desde body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Configuración se sesión
app.set("trust proxy", 1);
app.use(
  session({
    proxy: true,
    //almaceno los datos de sesión en mongo atlas
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      // mongoOptions:{ useNewUrlParser: true, useUnifiedTopology: true},
      ttl: 60 * 60,
    }),
    //nuevo
    cookie: {
      // secure: true,
      secure: config.environment === "prod", // Only works on HTTPS (set to false for local dev)
      httpOnly: true, // Prevents client-side access
      sameSite: config.environment === "prod" ? "none" : "lax", // Allows some cross-site requests
      // sameSite: "none",
      maxAge: 60 * 60 * 1000,
    }, //termina lo nuevo
    secret: secret,
    resave: false,
    //resave mantiene la sesión guardada en memoria del servidor aunque haya tiempo de inactividad, no hace falta si estoy guardando en mongo
    saveUninitialized: false,
    //guarda la sesión aún cuando el objeto "sesión" esté vacío
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

// inicializePassport(); // Initialize Passport strategies
// app.use(passport.initialize()); // Attach Passport middleware
app.use(cookieParser());

app.use(express.static("/public"));


app.get("/session/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

//Nodemailer
app.use("/email", email_router);

//Conexión con las rutas

app.use("/session", session_router);
app.use("/alumnos", alumnos_router);
//admin
app.use("/clases", clases_router);
app.use("/notas", notas_router);
app.use("/pagos", pagos_router);
app.use("/asistencias", asistencias_router);
app.use("/material", material_router);
app.use("/tp", tp_router)

// agarrar datos de usuario para cuando se recarga la página
app.use("/user", user_router);
console.log("🔥 Server running in", config.environment, "mode");
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
