import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, passportCall } from "../utils/utils.js";

const router = Router();

router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const alumnos = await alumnosModel.find().sort({ apellido: 1 });
      return res.json(alumnos);
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Encontrar un alumno por id

// router.get(
//   "/:id",
//   passportCall("jwt"),
//   authorization("alumno"),
//   async (req, res) => {
//     try {
//       const { id } = req.params;

//       const alumno = await alumnosModel.find({ _id: id }).populate("notas");
//       if (!alumno) {
//         return res.json({ message: `Alumno no encontrado` });
//       }

//       return res.json({
//         status: 200,
//         message: `Alumno encontrado`,
//         alumno,
//       });
//     } catch (error) {
//       return res.json({
//         message: "Error",
//         error,
//       });
//     }
//   }
// );

//Encontrar un alumno por email

router.get(
  "/:email",
  passportCall("jwt"),
  authorization("alumno"),
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

//Registrar a un nuevo alumno
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const alumno = req.body;
      const response = await alumnosModel.create(alumno);
      return res.json({
        Status: 200,
        Message: "Alumno ingresado correctamente",
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

//Editar los datos de un alumno
//put reemplaza todo el registro, patch solamente una propiedad

router.put(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const alumno = alumnosModel.find({ _id: id });
      if (!alumno) {
        return res.json({ message: `Alumno no encontrado` });
      }

      const alumnoActualizado = req.body;

      const response = await alumnosModel.updateOne(
        { _id: id },
        alumnoActualizado
      );

      if (response.modifiedCount == 0) {
        return res.json({
          message: "No se pudieron actualizar los datos",
        });
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
