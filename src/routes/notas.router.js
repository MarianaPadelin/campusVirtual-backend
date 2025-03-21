import { Router } from "express";
import { notasModel } from "../../models/notas.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, authMiddleware } from "../utils/utils.js";

const router = Router();

//Get all
router.get("/", async (req, res) => {
  try {
    const notas = await notasModel.find();
    return res.json(notas);
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notasModel.find({ _id: id });

    if (!nota) {
      return res.json({
        message: "No existe la nota",
      });
    }
    return res.json({
      status: 200,
      message: "Nota encontrada",
      nota,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Poner notas a un alumno
router.post("/", authMiddleware, authorization("admin"), async (req, res) => {
  try {
    //si ya existe la nota (ej: la de julio) modificar la existente
    const nota = req.body;
    const response = await notasModel.create(nota);
    const alumno = await alumnosModel.findById(response.id_alumno);
    alumno.notas.push(response._id);
    const update = await alumnosModel.findByIdAndUpdate(
      { _id: alumno._id },
      alumno
    );

    return res.json({
      status: 200,
      message: "Nota ingresada correctamente",
      response,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Corregir las notas de un alumno
router.put("/:id", authMiddleware, authorization("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const nota = notasModel.find({ _id: id });

    if (!nota) {
      return res.json({
        Message: "Nota no encontrada",
      });
    }
    const notaCorregida = req.body;
    const response = await notasModel.updateOne({
      _id: id,
      notaCorregida,
    });

    if (response.modifiedCount == 0) {
      return res.json({
        message: "No se pudo cambiar la nota",
      });
    }

    return res.json({
      status: 200,
      message: `Nota corregida`,
      response,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Borrar una nota
router.delete(
  "/:id/:id_alumno",
  authMiddleware,
  authorization("admin"),
  async (req, res) => {
    try {
      const { id, id_alumno } = req.params;
      const nota = await notasModel.findByIdAndDelete(id);

      if (!nota) {
        return res.json({
          status: 404,
          message: `Nota no encontrada`,
        });
      }
      const alumno = await alumnosModel.findById(id_alumno).populate("notas");

      if (!alumno) {
        return res.json({
          status: 404,
          message: `Alumno no encontrado`,
        });
      }

      alumno.notas = alumno.notas.filter((n) => n._id.toString() !== id);
      const notasRepetidas = alumno.notas.filter(
        (notaRepetida) =>
          notaRepetida.clase === nota.clase && notaRepetida.año == nota.año
      );

      if (notasRepetidas.length > 0) {
        for (const notaRepetida of notasRepetidas) {
          await notasModel.deleteOne({ _id: notaRepetida._id });
          alumno.notas = alumno.notas.filter(
            (n) => n._id.toString() !== notaRepetida._id.toString()
          );
        }
      }
      await alumno.save();
      return res.json({
        status: 200,
        message: `Nota eliminada`,
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
