import { Router } from "express";
import { loader } from "../utils/loader.js";
import { authorization, passportCall } from "../utils/utils.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { tpModel } from "../../models/tp.model.js";

const router = Router();

//ver los tps de un alumno por id
router.get(
  "/:id",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try{
      const { id } = req.params;
      const alumno = await alumnosModel.findOne({ _id: id });
      if(!alumno){
        return res.json({
          status: 404,
          message: "Alumno no encontrado"
        })
      }

      const tps = alumno.tps; 
      return res.json({
        status: 200,
        tps
      })
    }catch(error){
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);


//subir un tp (alumno)
router.post(
  "/",
  passportCall("jwt"),
  authorization("alumno"),
  loader.single("file"),

  async (req, res) => {
    try {
      const data = req.body;
      console.log(data);

      if (!req.file) {
        return res.json({
          status: 404,
          message: "No se encontró ningún archivo.",
        });
      }

      const tp = {
        idAlumno: data.idAlumno,
        nombre: req.file.originalname,
        fecha: data.fecha,
        clase: data.clase,
        url: req.file.path,
      };

      const response = await tpModel.create(tp)
      const alumno = await alumnosModel.findById({ _id: data.idAlumno });
      if (!alumno) {
        return res.json({
          status: 404,
          message: "No se encontró el alumno.",
        });
      }

      alumno.tps.push(response);
      await alumnosModel.findByIdAndUpdate({ _id: data.idAlumno }, alumno);
      res.json({
        status: 200,
        message: "Archivo cargado correctamente.",
        tp,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Error",
        error,
      });
    }
  }
);


router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      const archivo = await tpModel.findByIdAndDelete(id);

      if(!archivo){
        return res.json({
          status: 404,
          message: "No se encontró el archivo"
        })
      }

      return res.json({
        status: 200,
        message: "Archivo eliminado",
        archivo,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Error",
        error,
      });
    }
  }
);
export default router;
