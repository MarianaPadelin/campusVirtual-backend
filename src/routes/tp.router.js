import { Router } from "express";
import { loader } from "../utils/loader.js";
import { authorization, authMiddleware } from "../utils/utils.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { tpModel } from "../../models/tp.model.js";
import { sendTpConfirmation } from "./email.router.js";
import { clasesModel } from "../../models/clases.model.js";

const router = Router();

//Ver todos los tps (admin)
router.get("/", authMiddleware, authorization("admin"), async (req, res) => {
  try {
    const listaTps = await tpModel.find().populate("idAlumno").sort("fecha");
    if (!listaTps) {
      return res.json({
        status: 404,
        message: "No se encontraron trabajos prácticos",
      });
    }
    return res.json({
      status: 200,
      listaTps,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//ver los tps de un alumno por id de alumno
router.get(
  "/:id",
  authMiddleware,
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const alumno = await alumnosModel
        .findOne({ _id: id })
        .populate("tps")
        .sort({ fecha: -1 });
      if (!alumno) {
        return res.json({
          status: 404,
          message: "Alumno no encontrado",
        });
      }

      const tps = alumno.tps;
      return res.json({
        status: 200,
        tps,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//mostrar todos los tps de un alumno para esa materia y ese año
router.get(
  "/admin/:id/:clase/:year",
  authMiddleware,
  authorization("admin"),
  async (req, res) => {
    try {
      const { id, clase, year } = req.params;
      const tps = await tpModel.find({ idAlumno : id, clase: clase, año: year})

      if(!tps){
        return res.json({
          status: 404,
          message: "No se encontraron trabajos prácticos",
        });
      }
      return res.json({
        status: 200,
        tps,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//mostrar los tps por clase por id alumno (alumno)
router.get(
  "/alumno/:id/:clase",
  authMiddleware,
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id, clase } = req.params;

      const tps = await tpModel.find({ idAlumno: id, clase: clase});

      if (!tps) {
        return res.json({
          status: 404,
          message: "No se encontraron trabajos prácticos",
        });
      }
      return res.json({
        status: 200,
        tps,
      });
    } catch (error) {
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
  authMiddleware,
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
        año: data.anio,
      };
      console.log("clase: ", data.clase, "año: ", data.anio);
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

      const response = await tpModel.create(tp);
      const alumno = await alumnosModel.findById({ _id: data.idAlumno });
      if (!alumno) {
        return res.json({
          status: 404,
          message: "No se encontró el alumno.",
        });
      }

      alumno.tps.push(response);
      await alumnosModel.findByIdAndUpdate({ _id: data.idAlumno }, alumno);

      //enviar email de confirmación:
      sendTpConfirmation(
        alumno.email,
        data.fecha,
        req.file.originalname,
        data.clase,
        data.anio
      );

      return res.json({
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

//subir un tp (alumno, desde LINK)
router.post(
  "/link",
  authMiddleware,
  authorization("alumno"),

  async (req, res) => {
    try {
      const data = req.body;
      console.log(data);

      const tp = {
        idAlumno: data.idAlumno,
        nombre: data.title,
        fecha: data.fecha,
        clase: data.clase,
        url: data.link,
        año: data.anio,
      };

      if (!data.link) {
        return res.json({
          status: 404,
          message: "Debe poner un link",
        });
      }

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
      const response = await tpModel.create(tp);
      const alumno = await alumnosModel.findById({ _id: data.idAlumno });
      if (!alumno) {
        console.log("llego a no hay alumno");
        return res.json({
          status: 404,
          message: "No se encontró el alumno.",
        });
      }
      alumno.tps.push(response);
      await alumnosModel.findByIdAndUpdate({ _id: data.idAlumno }, alumno);

      //enviar email de confirmación:
      sendTpConfirmation(
        alumno.email,
        data.fecha,
        data.title,
        data.clase,
        data.anio
      );

      return res.json({
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
  authMiddleware,
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const archivo = await tpModel.findByIdAndDelete(id);

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

//subir la nota y devolución del tp(admin)
router.post(
  "/sendNota/:id",
  authMiddleware,
  authorization("admin"),
  async (req, res) => {
    console.log("llego a la ruta");
    try {
      //id del tp
      const { id } = req.params;
      const data = req.body;
      console.log("data recibida", data.notaTP);

      //busco el tp por id y le agrego las props nota y devolución
      const tp = await tpModel.findById(id);
      if (!tp) {
        return res.json({
          status: 404,
          message: "No se encontró el trabajo práctico",
        });
      }

      await tpModel.findByIdAndUpdate({
        _id: id },
       { nota: data.notaTP,
        devolucion: data.devolucionTP }
      );

      return res.json({
        status: 200,
        message: "Nota ingresada con éxito"
      })

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
