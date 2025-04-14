import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { asistenciasModel } from "../../models/asistencias.model.js";
import { authorization, authMiddleware } from "../utils/utils.js";
import dayjs from "dayjs";

const router = Router();

router.get("/:clase/:date", authMiddleware, authorization("admin"), async(req, res) => {
  try{
    const {clase, date} = req.params;
    const fecha = dayjs(date).format("DD/MM/YYYY");

    const response = await asistenciasModel.find({clase: clase, fecha: fecha}).populate("id_alumno")
    return res.json({
      status: 200,
      response
    });
  }catch(error){
     return res.json({
       message: "Error",
       error,
     });
  }
})

router.post("/", authMiddleware, authorization("admin"), async (req, res) => {
  try {
    const asistencias = req.body.data;
    console.log(asistencias);

    const responses = [];
    //marcar los ausentes en vez de los presentes
    for (const asistencia of asistencias) {
      const response = await asistenciasModel.create(asistencia);

      const alumno = await alumnosModel.findById(response.id_alumno);
      alumno.asistencias.push(response._id);
      await alumnosModel.findByIdAndUpdate({ _id: alumno._id }, alumno);
      //agarrar la clase, dentro de la clase al alumno, y a faltas disponibles restarle 1
      // const claseTarget = await clasesModel.find({ nombre: asistencia.clase})
      // console.log(claseTarget)
      // responses.push(response);
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
