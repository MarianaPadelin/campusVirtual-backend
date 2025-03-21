import { Router } from "express";
import { userModel } from "../../models/user.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import {
  createHash,
  // generateJWToken,
  isValidPassword,
} from "../utils/utils.js";
import config from "../config/config.js";
import { sendEmail } from "./email.router.js";
import { authorization, authMiddleware } from "../utils/utils.js";

//usuario o contraseña incorrectos = 401
//usuario no autorizado = 403
const router = Router();



//Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const datosRegistro = {
      email: email.toLowerCase(),
      password,
    };
    const userExists = await userModel.findOne({ email: datosRegistro.email });
    if (userExists) {
      return res.json({
        status: 400,
        message: "El usuario ya está registrado",
      });
    }
    const esAlumno = await alumnosModel.findOne({ email: datosRegistro.email });
    const esAdmin = config.adminMail;
    const esAdmin2 = config.adminMail2;
    const esAdmin3 = config.adminMail3;
    if (
      !esAlumno &&
      datosRegistro.email !== esAdmin &&
      datosRegistro.email !== esAdmin2 &&
      datosRegistro.email !== esAdmin3
    ) {
      return res.json({
        status: 500,
        message: "Este email no está registrado",
      });
    }
    if (
      datosRegistro.email === esAdmin ||
      datosRegistro.email === esAdmin2 ||
      datosRegistro.email === esAdmin3
    ) {
      const user = {
        email: datosRegistro.email,
        password: createHash(password),
        role: "admin",
      };
      const result = await userModel.create(user);
      sendEmail(datosRegistro.email);
      return res.json({
        status: 200,
        message: "Usuario creado correctamente",
        result,
      });
    } else {
      const user = {
        email: datosRegistro.email,
        password: createHash(password),
      };
      const result = await userModel.create(user);
      sendEmail(datosRegistro.email);
      return res.json({
        status: 200,
        message: "Usuario creado correctamente",
        result,
      });
    }
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
    const datosLogin = {
      email: email.toLowerCase(),
      password,
    };
    //validación: El email tiene que estar en la db de alumnos pero no en la de usuarios
    const userExists = await userModel.findOne({ email: datosLogin.email });
    if (!userExists) {
      return res.json({
        status: 400,
        message: "El usuario no está registrado",
      });
    } else if (!isValidPassword(userExists, password)) {
      return res.json({
        status: 401,
        message: "Credenciales incorrectas",
      });
    }

    //AGREGO
    req.session.user = {
      email: userExists.email,
      role: userExists.role,
    };
    console.log("datos del usuario en sesiones", req.session.user); //TERMINO

    //inicio la sesión con jwt

    // const tokenUser = {
    //   email: userExists.email,
    //   role: userExists.role,
    // };
    // // console.log(tokenUser);
    // const access_token = generateJWToken(tokenUser);
    // console.log(tokenUser);

    // res.cookie("jwtCookieToken", access_token, {
    //   httpOnly: true, // Prevents JavaScript access for security
    //   secure: true, // Use only in HTTPS environments
    //   sameSite: "None", // Required for cross-site requests when using credentials

    //   maxAge: 2 * 60 * 60 * 1000, // 2 hours
    // });

    // Save the session to make sure it persists
    req.session.save((err) => {
      if (err) {
        console.error("❌ Error al guardar la sesión:", err);
        return res.status(500).json({ message: "Error al guardar la sesión" });
      }
      const isAdmin =
        datosLogin.email === config.adminMail ||
        datosLogin.email === config.adminMail2 ||
        datosLogin.email === config.adminMail3;

      return res.json({
        status: 200,
        message: isAdmin
          ? "Admin logueado correctamente"
          : "Usuario logueado correctamente",
        user: req.session.user, // Send session data
      });

    });
   
    // if (
    //   datosLogin.email === config.adminMail ||
    //   datosLogin.email === config.adminMail2 ||
    //   datosLogin.email === config.adminMail3
    // ) {
    //   return res.json({
    //     status: 201,
    //     tokenUser,
    //     message: "Admin logueado correctamente",
    //     jwt: access_token,
    //   });
    // }
    // return res.json({
    //   status: 200,
    // tokenUser,
    //   message: "Usuario logueado correctamente",
    // jwt: access_token,
    //   user: req.session.user
    // });
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
    const datosReset = {
      email: email.toLowerCase(),
      password,
    };
    const { token } = req.params;
    const userExists = await userModel.findOne({ email: datosReset.email });
    if (!userExists) {
      return res.json({
        status: 400,
        message: "El usuario no existe",
      });
    }
    const esAlumno = await alumnosModel.findOne({ email: datosReset.email });
    if (
      !esAlumno &&
      datosReset.email !== config.adminMail &&
      datosReset.email !== config.adminMail2 &&
      datosReset.email !== config.adminMail3
    ) {
      return res.json({
        status: 500,
        message: "Este email no está registrado como un alumno de la escuela",
      });
    }

    const user = {
      email: datosReset.email,
      password: createHash(password),
    };

    const result = await userModel.updateOne(
      { _id: userExists._id },
      { $set: user }
    );

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

router.delete(
  "/:email",
  authMiddleware,
  authorization("admin"),
  async (req, res) => {
    try {
      const { email } = req.params;
      const userExists = await userModel.findOne({ email });
      console.log(userExists);
      if (!userExists) {
        return res.json({
          status: 404,
          message: "No se encontró al usuario",
        });
      }

      await userModel.deleteOne(userExists);
      return res.json({
        status: 200,
        message: "Usuario eliminado",
        userExists,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Error deleting email",
        error,
      });
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("error cerrando la sesión")
        return res.json({
          error: "Error logout",
          message: "Error al cerrar la sesión",
        });
      }
      // res.clearCookie("jwtCookieToken", {
      //   httpOnly: true, // Ensure the cookie isn't accessible via JavaScript
      //   secure: true,
      //   sameSite: "None", // This should match how you're setting the cookie
      // });
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: config.environment === "prod" ? true: false,
        sameSite: config.environment === "prod" ? "None": "Lax", // Allows some cross-site requests
      });
      console.log("sesión cerrada")
      return res.json({
        status: 200,
        message: "Sesión cerrada correctamente",
      });
    });
  } catch (error) {
    console.log(error);
  }
});
export default router;
