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

//Ver pagos por mes

router.get(
  "/mes/:month/:year",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { month, year } = req.params;

      // Ensure month is always two digits
      const formattedMonth = month.padStart(2, "0");

      // Regular expression to match 'dd/mm/yyyy' format for the given month and year
      const regex = new RegExp(`^\\d{2}/${formattedMonth}/${year}$`);

      const pagos = await pagosModel
        .find({ fecha: { $regex: regex } })
        .populate("id_alumno");

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
  }
);

//Get pago by id, el alumno puede ver qué pagos hizo

router.get(
  "/:id",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const pagos = await pagosModel.find({ id_alumno: id });
      return res.json({
        status: 200,
        message: "Pagos encontrados",
        pagos,
      });
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
      const { id_alumno, fecha, monto } = pago;
      const response = await pagosModel.create(pago);

      const alumno = await alumnosModel.findById(id_alumno);
      alumno.pagos.push(response._id);
      const update = await alumnosModel.findByIdAndUpdate(
        { _id: alumno._id },
        alumno
      );
      const email = alumno.email;

      //envío email con comprobante
      sendComprobante(email, fecha, monto);
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

//Editar un pago
router.put(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { monto } = req.body;
      const pago = await pagosModel.findById(id);
      if (!pago) {
        return res.json({
          status: 404,
          message: "No se encontró el pago",
        });
      }
      const pagoActualizado = await pagosModel.findByIdAndUpdate(
        id,
        { $set: { monto: monto } },
        // { new: true } // This returns the updated document
      );

      if (!pagoActualizado) {
        return res.json({
          status: 500,
          message: "Error actualizando el pago",
        });
      }
      return res.json({
        status: 200,
        message: "Pago actualizado con éxito",
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Eliminar un pago
router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await pagosModel.findByIdAndDelete(id);

      if (!pago) {
        return res.json({
          status: 404,
          message: "No se encontró el pago",
        });
      }

      res.json({
        status: 200,
        message: "Pago eliminado",
      });
    } catch (error) {
      return res.json({
        message: "Error del servidor",
        error,
      });
    }
  }
);
export default router;
