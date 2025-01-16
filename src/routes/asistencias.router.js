import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { asistenciasModel } from "../../models/asistencias.model.js";

const router = Router();


router.post("/", async (req, res) => {
  try {
    const asistencias = req.body.data;
    console.log(asistencias);

    const responses = [];

    for (const asistencia of asistencias) {
    const response = await asistenciasModel.create(asistencia);

    const alumno = await alumnosModel.findById(response.id_alumno);
    alumno.asistencias.push(response._id);
    await alumnosModel.findByIdAndUpdate({ _id: alumno._id }, alumno);

    responses.push(response);
     }

   

    res.json({
      status: 200,
      Message: "Asistencias ingresadas correctamente",
      responses,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});


export default router;
