import config from "../config/config.js";
import { Router } from "express";
import nodemailer from "nodemailer";
import { userModel } from "../../models/user.model.js";
import { v4 } from "uuid";

const router = Router();

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

export const sendTpConfirmation = async (email, fecha, nombre, clase, año) => {
  try {
    let result = transporter.sendMail({
      from: "Campus virtual circo de las artes - " + config.emailAcount,
      to: email,
      subject: "TP subido",
      html: `<div>
      <p>El trabajo práctico se subió correctamente a la página.
      <ul>
        <li>Fecha de carga: ${fecha}</li>
        <li>Nombre del archivo: ${nombre}</li>
        <li>Clase: ${clase}</li>
        <li>Año: ${año}
        </ul>
      </p>
      </div>`,
    });

    console.log(`Email enviado a: ${email}`);

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

export default router;
