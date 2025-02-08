import { Router } from "express";
import { pagosModel } from "../../models/pagos.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, passportCall } from "../utils/utils.js";
import { sendComprobante } from "./email.router.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pagos = await pagosModel.find();

    if (!pagos) {
      return res.json({
        status: 404,
        message: "No se encontraron pagos",
      });
    }

    return res.json({
      status: 200,
      pagos,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Get pago by id, el alumno puede ver qué pagos hizo

router.get(
  "/:id",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id } = req.params; 

      const pagos = await pagosModel.find({ id_alumno: id})
      return res.json({
        status: 200,
        message: "Pagos encontrados",
        pagos
      })

    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }


  }
);

//Cargar pagos
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const pago = req.body;
      const  { id_alumno, fecha, monto } = pago;
      const response = await pagosModel.create(pago);

      const alumno = await alumnosModel.findById(id_alumno);
      alumno.pagos.push(response._id);
      const update = await alumnosModel.findByIdAndUpdate(
        { _id: alumno._id },
        alumno
      );
      const email = alumno.email;

      //envío email con comprobante
      sendComprobante(email, fecha, monto)
      res.json({
        status: 200,
        Message: "Pago ingresado correctamente",
        response,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

export default router;
