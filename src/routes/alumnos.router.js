import { Router } from "express";
import { alumnosModel } from "../../models/alumnos.model.js";
import { clasesModel } from "../../models/clases.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const alumnos = await alumnosModel.find().sort({ apellido: 1 });
    return res.json(alumnos);
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await alumnosModel.find({ _id: id }).populate("notas");
    if (!alumno) {
      return res.json({message: `Alumno no encontrado`});
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
});

//Ver las notas del alumno

router.get("/:id/notas", async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await alumnosModel.find({ _id: id }).populate("notas");
    if (!alumno) {
      return res.json({ message: `Alumno no encontrado` });
    }
    const result = alumno[0].notas;

    return res.json({
      result
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

router.post("/", async (req, res) => {
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
});

//put reemplaza todo el registro, patch solamente una propiedad

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = alumnosModel.find({ _id: id });
    if (!alumno) {
      return res.json({ message: `Alumno no encontrado` });
    }
    // alumno.nota.push("676d7e1eec0d3161e60c57c7");
    console.log(alumno.nota);

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
});

router.delete("/:id", async (req, res) => {
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
});

export default router;
