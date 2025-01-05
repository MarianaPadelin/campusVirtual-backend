import { Router } from "express";
import { notasModel } from "../../models/notas.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";

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

//Post
router.post("/", async (req, res) => {
  try {
    const nota = req.body;
    const response = await notasModel.create(nota);

    //push al array de notas en alumno
    //update del alumno

    // const alumno = await alumnosModel.findById("nota del alumno");
    // alumno.notas.push(nota._id);
    // const update = await alumnosModel.findByIdAndUpdate(
    //   { _id: alumno._id },
    //   alumno
    // );

    res.json({
      Status: 200,
      Message: "Nota ingresada correctamente",
      response,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//Put
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const nota = notasModel.find({ _id: id })

    if(!nota){
        return res.json({
            Message: 'Nota no encontrada'
        })
    }
    const notaCorregida = req.body;
    const response = await notasModel.updateOne({
        _id: id,
        notaCorregida
    })

    if(response.modifiedCount == 0){
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

//Delete
router.delete("/:id", async (req, res) => {
  try {
     const { id } = req.params;
     const nota = await notasModel.findByIdAndDelete({ _id: id });

     if (!nota) {
       return res.json({ message: `Nota no encontrada` });
     }
     return res.json({
       status: 200,
       message: `Nota eliminada`,
       nota,
     });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});



export default router;