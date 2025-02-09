import { Router } from "express";
import { loader } from "../utils/loader.js";
import { authorization, passportCall } from "../utils/utils.js";
import { clasesModel } from "../../models/clases.model.js";
import { materialModel } from "../../models/material.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";

const router = Router();

//Ver todo el array de archivos de una clase y un año
//ver permisos para que el alumno solo lo pueda ver si está anotado en esa clase
router.get(
  "/:nombreClase/:year",
  passportCall("jwt"),
  authorization(["admin", "alumno"]),
  async (req, res) => {
    try {
      const { nombreClase, year } = req.params;
      console.log(nombreClase, year);
      const clase = await clasesModel
        .findOne({ nombre: nombreClase, año: year })
        .populate("archivos")
        .sort({ fecha: -1 });

      if (!clase) {
        return res.json({
          status: 404,
          message: "Clase no encontrada",
        });
      }
      if (!year) {
        return res.json({
          status: 404,
          message: "Año no encontrado",
        });
      }

      const result = clase.archivos;

      return res.json({
        status: 200,
        result,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Subir material didáctico
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  loader.single("file"),
  async (req, res) => {
    try {
      const data = req.body;
      if (!req.file) {
        return res.json({
          status: 404,
          message: "No se encontró ningún archivo.",
        });
      }

      //primero creo el archivo en su coleccion material
      const archivo = {
        nombre: req.file.originalname,
        fecha: data.fecha,
        url: req.file.path,
        clase: data.clase,
        año: data.anio,
      };

      const archivoExiste = await materialModel.findOne({
        nombre: req.file.originalname,
        clase: data.clase,
        año: data.anio,
      });

      if (archivoExiste) {
        return res.json({
          status: 400,
          message: "Ya existe un archivo con ese nombre",
        });
      }

      const response = await materialModel.create(archivo);

      //Lo agrego a la clase:

      const clase = await clasesModel.findOne({
        nombre: data.clase,
        año: data.anio,
      });
      if (!clase) {
        return res.json({
          status: 404,
          message: "No se encontró la clase.",
        });
      }

      clase.archivos.push(response);

      await clasesModel.findByIdAndUpdate({ _id: clase._id }, clase);
      res.json({
        status: 200,
        message: "Archivo cargado correctamente.",
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const archivo = await materialModel.findByIdAndDelete(id);
      if (!archivo) {
        return res.json({
          status: 404,
          message: "No se encontró el archivo",
        });
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
