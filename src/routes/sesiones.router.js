import { Router } from "express";
import { userModel } from "../../models/user.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

//usuario o contraseña incorrectos = 401
//usuario no autorizado = 403
const router = Router();

//Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.json({
        status: 400,
        message: "El usuario ya está registrado",
      });
    }
    const esAlumno = await alumnosModel.findOne({ email });
    if (!esAlumno) {
      return res.json({
        status: 500,
        message: "Este email no está registrado como un alumno de la escuela",
      });
    }

    const user = {
      email,
      password: createHash(password),
    };

    const result = await userModel.create(user);

    res.json({
      status: 200,
      message: "Usuario creado correctamente",
      result,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validación: El email tiene que estar en la db de alumnos pero no en la de usuarios
    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      return res.json({
        status: 401,
        message: "El usuario no existe",
      });

    } else if (!isValidPassword(userExists, password)) {

      return res.json({
        status: 401,
        message: "Credenciales incorrectas",
      });
    }

    //si el login es correcto, inicio la sesión
    req.session.user = {
      email: userExists.email,
    };

    return res.json({
      status: 200,
      message: "Usuario logueado correctamente",
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Recuperar contraseña
router.put("/resetPassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.json({
        status: 400,
        message: "El usuario no existe",
      });
    }
    const esAlumno = await alumnosModel.findOne({ email });
    if (!esAlumno) {
      return res.json({
        status: 500,
        message: "Este email no está registrado como un alumno de la escuela",
      });
    }

    const user = {
      email,
      password: createHash(password),
    };

    const result = await userModel.updateOne({ _id: userExists._id}, {$set: user});

    res.json({
      status: 200,
      message: "Contraseña actualizada",
      result,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se visitó este sitio ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send(`Bienvenido. Se visitó este sitio ${req.session.counter} veces`);
  }
});

router.get("/login", (req, res) => {
  const { username, password } = req.query;

  //creo las propiedades user y admin
  req.session.user = username;
  req.session.admin = true;
  res.status(200).json({
    message: "Sesión iniciada",
    username,
    password,
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({
        error: "Error logout",
        message: "Error al cerrar la sesión",
      });
    }
    res.json({
      message: "Sesión cerrada correctamente",
    });
  });
});
export default router;
