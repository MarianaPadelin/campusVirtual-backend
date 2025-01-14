import { Router } from "express";
import { pagosModel } from "../../models/pagos.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";

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

router.post("/", async (req, res) => {
  try {
    const pago = req.body;

    const response = await pagosModel.create(pago);

    const alumno = await alumnosModel.findById(response.id_alumno);
    alumno.pagos.push(response._id);
    const update = await alumnosModel.findByIdAndUpdate(
      { _id: alumno._id },
      alumno
    );
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
});

export default router;
