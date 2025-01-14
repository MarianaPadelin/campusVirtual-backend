import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { asistenciasModel } from "../../models/asistencias.model.js";

const router = Router();


router.post("/", async (req, res) => {
  try {
    const asistencia = req.body;
    console.log(asistencia)

    // const responses = [];


    // for (const asistencia of asistencias) {
        const response = await asistenciasModel.create(asistencia);

        const alumno = await alumnosModel.findById(response.id_alumno);
        alumno.asistencias.push(response._id);
        await alumnosModel.findByIdAndUpdate({ _id: alumno._id }, alumno);

        // responses.push(response);
    //  }
    
    res.json({
      status: 200,
      Message: "Asistencias ingresadas correctamente",
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
