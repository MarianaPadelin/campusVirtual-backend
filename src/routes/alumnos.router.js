import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, passportCall } from "../utils/utils.js";
import { clasesModel } from "../../models/clases.model.js";
import { userModel } from "../../models/user.model.js";
import { notasModel } from "../../models/notas.model.js";
import { asistenciasModel } from "../../models/asistencias.model.js";
import { tpModel } from "../../models/tp.model.js";

const router = Router();

//Ver una lista de todos los alumnos
router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const alumnos = await alumnosModel.find().sort({ apellido: 1 });
      return res.json({
        status: 200,
        alumnos,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Encontrar un alumno por id

router.get(
  "/getById/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const alumno = await alumnosModel
        .findOne({ _id: id })
        .populate("notas")
        .populate("pagos");
      if (!alumno) {
        return res.json({ message: `Alumno no encontrado` });
      }

      return res.json({
        status: 200,
        message: `Alumno encontrado`,
        alumno,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Encontrar un alumno por email

router.get(
  "/getByEmail/:email",
  passportCall("jwt"),
  authorization(["admin", "alumno"]),
  async (req, res) => {
    try {
      const { email } = req.params;

      const alumno = await alumnosModel
        .findOne({ email: email })
        .populate("notas");
      if (!alumno) {
        return res.json({ message: `Alumno no encontrado` });
      }

      return res.json({
        status: 200,
        message: `Alumno encontrado`,
        alumno,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Ver las notas del alumno

router.get(
  "/:id/notas/:year",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id, year } = req.params;
      const alumno = await alumnosModel.findOne({ _id: id }).populate("notas");
      if (!alumno) {
        return res.json({ status: 404, message: `Alumno no encontrado` });
      }
      const result = alumno.notas.filter((nota) => nota.año == year);

      return res.json({
        status: 200,
        result,
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


//Ver las asistencias de un alumno, agrupadas por clase
router.get(
  "/:id/asistencias/:year",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { id, year } = req.params;
      const alumno = await alumnosModel
        .findOne({ _id: id })
        .populate("asistencias");
      if (!alumno) {
        return res.json({ status: 404, message: `Alumno no encontrado` });
      }
      //encontrar las clases en las que participa el alumno
      const clasesQueToma = await clasesModel.find({ alumnos: id, año: year });

      //array de asistencias del alumno con su id, clase y fecha
      const asistenciasPorAnio = alumno.asistencias.filter((a) =>
        a.fecha.includes(year)
      );

      const asistenciasPorClase = {};
      clasesQueToma.forEach((clase) => {
        asistenciasPorClase[clase.nombre] = {
          ausentes: 0, // Start with 0 absences
          totalFaltas: clase.faltas, // Get the total allowed absences from class
        };
      });


      if (clasesQueToma.length === 0) {
        //si no hay clases en ese año
        return res.json({
          status: 200,
          asistenciasPorClase: [],
        });
      }
      asistenciasPorAnio.forEach(({ clase, asistencia: ausente }) => {
        //asistencia: true es ausente
        if (ausente) {
          asistenciasPorClase[clase].ausentes += 1; // Count absences
        }
      });

      //Devuelve un array
      const asistenciasPorClaseArray = Object.entries(asistenciasPorClase).map(
        ([clase, data]) => ({
          clase,
          ausentes: data.ausentes,
          totalFaltas: data.totalFaltas,
        })
      );
      return res.json({
        status: 200,
        asistenciasPorClase: asistenciasPorClaseArray,
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

//Registrar a un nuevo alumno
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { nombre, apellido, email, celular } = req.body;

      const alumno = {
        nombre: nombre.toUpperCase(),
        apellido: apellido.toUpperCase(),
        email: email.toLowerCase(),
        celular,
      };
      const response = await alumnosModel.create(alumno);
      return res.json({
        status: 200,
        message: "Alumno ingresado correctamente",
        response,
      });
    } catch (error) {
      return res.json({
        message: "El email ya existe en la base de datos",
        error,
      });
    }
  }
);

//Editar los datos de un alumno
router.put(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const alumno = await alumnosModel.findOne({ _id: id });
      console.log(alumno);
      if (!alumno) {
        return res.json({ message: `Alumno no encontrado` });
      }

      const { nombre, apellido, email, celular } = req.body;
      const alumnoActualizado = {
        nombre: nombre.toUpperCase(),
        apellido: apellido.toUpperCase(),
        email: email.toLowerCase(),
        celular,
      };
      console.log(
        "comparativa de mails: ",
        alumnoActualizado.email,
        alumno.email
      );

      const response = await alumnosModel.updateOne(
        { _id: id },
        alumnoActualizado
      );
      if (response.modifiedCount == 0) {
        return res.json({
          message: "No se pudieron actualizar los datos",
        });
      }

      //si se modifica el email, eliminar el usuario con el email viejo
      if (alumnoActualizado.email !== alumno.email) {
        const usuario = await userModel.findOneAndDelete({
          email: alumno.email,
        });
        console.log(usuario);
        if (!usuario) {
          return res.json({
            status: 200,
            message: `Alumno actualizado`,
            response,
          });
        }
      }

      return res.json({
        status: 200,
        message: `Alumno actualizado`,
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

//ELiminar a un alumno de la DB
router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const alumno = await alumnosModel.findByIdAndDelete({ _id: id });

      if (!alumno) {
        return res.json({ message: `Alumno no encontrado` });
      }

      await notasModel.deleteMany({ id_alumno: id });
      await asistenciasModel.deleteMany({ id_alumno: id });
      await tpModel.deleteMany({ idAlumno: id });
      await certificadoModel.deleteMany({ id_alumno: id });

      await userModel.deleteOne({ email: alumno.email });
      return res.json({
        status: 200,
        message: `Alumno borrado`,
        alumno,
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
