import config from "../config/config.js";
import { Router } from "express";
import nodemailer from "nodemailer";
import { userModel } from "../../models/user.model.js";
import { v4 } from "uuid";

const router = Router();
const recieverEmail = "marianapadelin@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587, //puerto de protocolo de mensajeria
  auth: {
    user: config.emailAcount,
    pass: config.appPassword,
  },
});

//Verificar la conexión con gmail:

transporter.verify((error, success) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Servicio listo para mensajería");
  }
});

const mailOptions = {
  from: "Campus virtual circo de las artes - " + config.emailAcount,
  to: recieverEmail,
  subject: "Registro exitoso",
  html: `<div>
    <p>El correo se registró correctamente en el campus virtual
    </div>`,
};

// // router.get("/", (req, res) => {
//   export const sendMail = (req, res) =>{
//     const
//   try {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//         res.json({
//           status: 400,
//           message: "Error enviando el mensaje",
//           payload: error,
//         });
//       }
//       console.log("Mensaje enviado", info.messageId);
//       res.json({
//         message: "Envío correcto",
//         payload: info,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: 500,
//       message: "No se pudo enviar el mail",
//       error,
//     });
//   }
// };

export const sendEmail = async (email) => {
  try {
    let result = transporter.sendMail({
      from: "Campus virtual circo de las artes - " + config.emailAcount,
      to: email,
      subject: "Registro exitoso",
      html: `<div>
      <p>El correo se registró correctamente en el campus virtual</p>
      </div>`,
    });

    console.log(`Email enviado a: ${email}`);

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//mandar comprobante
export const sendComprobante = async (email, fecha, importe) => {
  try {
    let result = transporter.sendMail({
      from: "Campus virtual circo de las artes - " + config.emailAcount,
      to: email,
      subject: "Comprobante de pago",
      html: `<div>
      <h1>Comprobante de pago - Circo de las artes</h1>
      <p>Se registró el siguiente pago: 
      <ul>
      <li>Importe: ${importe}</li>
      <li>Fecha: ${fecha}</li>
      </ul>
      </p>
      </div>`,
    });

    console.log(`Email enviado a: ${email}, importe: $ ${importe}, fecha: ${fecha}`);

    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//Reset de contraseña:

const mailOptionsToReset = {
  from: "Campus virtual circo de las artes - " + config.emailAcount,
  subject: "Restaurar contraseña",
};

const tempDbMails = {};

//mandar un email con el código provisorio
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await userModel.findOne({ email: email });

    if (!userExists) {
      return res.json({
        status: 404,
        message: "El email no está registrado",
      });
    }
    // Genero un id provisorio con la libreria uuid
    const token = v4();

    //Ocultar el link en .env
    const link = `${config.restoreLink}/${token}`;

    //le genero una propiedad token a tempDBMails
    tempDbMails[token] = {
      email,
      expirationTime: new Date(Date.now() + 60 * 60 * 1000), //1 hora
    };

    // req.logger.info(tempDbMails);
    console.log(tempDbMails);

    mailOptionsToReset.to = email;
    mailOptionsToReset.html = `Para restaurar tu contraseña seguir este enlace: <a href="${link}"> Restaurar Contraseña </a>`;

    transporter.sendMail(mailOptionsToReset, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error", payload: error });
      }
      res.json({ status: 200, message: "Success", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: 500,
      error: error,
      message: "No se pudo enviar el email",
    });
  }
});

//el link de reset password me lleva acá, se fija si el link es válido y te redirige al formulario de restaurar contaseña
router.get("/reset/:token", (req, res) => {
  const token = req.params.token;

  const email = tempDbMails[token];

  const now = new Date();
  const expirationTime = email?.expirationTime;

  if (now > expirationTime || !expirationTime) {
    delete tempDbMails[token];
    console.error("El link expiró");
    return res.redirect(`${config.rootUrl}/sendEmail`);
  }
  return res.redirect(`${config.rootUrl}/resetPassword/${[token]}`);
});

//esta ruta ya está en sessions
// export const restorePassword = async (req, res) => {
//   try {
//     const { email, password, repeatPassword } = req.body;
//     if (password !== repeatPassword) {
//       req.logger.error("Both passwords must be the same");
//       return res.status(401).send("Both passwords must be the same");
//     }
//     const userExists = await userService.findUser(email);

//     if (!userExists) {
//       return res.status(404).send("Email not found");
//     }
//     if (validatePass(userExists, password)) {
//       req.logger.error("Can't use previous password");
//       return res.status(400).send("Can't use previous password");
//     }
//     const result = await userService.updatePassword(email, password);

//     return res.status(200).send("contraseña actualizada");
//   } catch (error) {

//     logger.error(error);
//     return error;
//   }
// };
export default router;
