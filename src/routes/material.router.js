import { Router } from "express";
import { loader } from "../utils/loader.js";
import { authorization, authMiddleware } from "../utils/utils.js";
import { clasesModel } from "../../models/clases.model.js";
import { materialModel } from "../../models/material.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { certificadoModel } from "../../models/certificados.model.js";

const router = Router();

router.get(
  "/:nombreClase/:year",
  authMiddleware,
  authorization(["admin", "alumno"]),
  async (req, res) => {
    try {
      const { nombreClase, year } = req.params;
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

//El alumno ve su certificado por año
router.get(
  "/certificado/:id/:year",
  authMiddleware,
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id, year } = req.params;
      const certificados = await certificadoModel.find({ id_alumno: id });
      console.log("certificados: ", certificados);
      const certActual = certificados.filter((c) => c.fecha.includes(year))[0];
      console.log("cert actual: ", certActual);

      if (!certActual) {
        return res.json({
          status: 404,
          message: "No tienes un certificado para este año",
        });
      }
      return res.json({
        status: 200,
        certActual,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Subir material didáctico (cargar archivo)
router.post(
  "/",
  authMiddleware,
  authorization("admin"),
  loader.single("file"),
  async (req, res) => {
    try {
      const data = req.body;

      console.log(data)
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
        description: data.description
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
      const response = await materialModel.create(archivo);

      clase.archivos.push(response);

      await clasesModel.findByIdAndUpdate({ _id: clase._id }, clase);
     return res.json({
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


//Subir material didáctico (link)
router.post(
  "/link",
  authMiddleware,
  authorization("admin"),
  async (req, res) => {
    try {
      const data = req.body;
      console.log(data)
      //primero creo el archivo en su coleccion material
      const archivo = {
        nombre: data.title,
        fecha: data.fecha,
        url: data.link,
        clase: data.clase,
        año: data.anio,
        description: data.description
      };

      
     if (!data.link) {
       return res.json({
         status: 404,
         message: "Debe poner un link",
       });
     }
      const archivoExiste = await materialModel.findOne({
        nombre: data.title,
        clase: data.clase,
        año: data.anio,
      });

      if (archivoExiste) {
        return res.json({
          status: 400,
          message: "Ya existe un archivo con ese nombre",
        });
      }


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
      const response = await materialModel.create(archivo);

      clase.archivos.push(response);

      await clasesModel.findByIdAndUpdate({ _id: clase._id }, clase);
      return res.json({
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

//subir certificado
router.post(
  "/certificado",
  authMiddleware,
  authorization("admin"),
  loader.single("file"),
  async (req, res) => {
    try {
      const data = req.body;
      const nombreMayuscula = data.nombreAlumno.toUpperCase();
      const apellidoMayuscula = data.apellidoAlumno.toUpperCase();
      console.log(data);
      //data me tiene que traer nombre del alumno, apellido, fecha y año
      if (!req.file) {
        return res.json({
          status: 404,
          message: "No se encontró ningún archivo.",
        });
      }

      const alumno = await alumnosModel.findOne({
        nombre: nombreMayuscula,
        apellido: apellidoMayuscula,
      });
      if (!alumno) {
        return res.json({
          status: 404,
          message: "No se encontró al alumno.",
        });
      }
      //primero creo el archivo en su coleccion material
      const archivo = {
        nombre: req.file.originalname,
        fecha: data.fecha,
        id_alumno: alumno._id, //ver
        año: data.año,
        url: req.file.path,
      };

      const archivoExiste = await certificadoModel.findOne({
        nombre: req.file.originalname,
        id_alumno: alumno._id,
        año: data.año,
      });

      if (archivoExiste) {
        return res.json({
          status: 400,
          message: `Ya existe un certificado para este alumno en el año ${data.año}`,
        });
      }

      const response = await certificadoModel.create(archivo);

      //Lo agrego al alumno:

      alumno.certificados.push(response);

      await alumnosModel.findByIdAndUpdate(alumno._id, alumno);
      res.json({
        status: 200,
        message: "Certificado cargado correctamente.",
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
  authMiddleware,
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
