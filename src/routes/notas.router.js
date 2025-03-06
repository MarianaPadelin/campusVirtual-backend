import { Router } from "express";
import { notasModel } from "../../models/notas.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, passportCall } from "../utils/utils.js";


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



// //Ver las notas por clase y año

// router.get(
//   "/notasporclase/:clase/:year",
//   // passportCall("jwt"),
//   // authorization("admin"),
//   async (req, res) => {
//     try {
//       const { clase, year } = req.params;
//       // const alumno = await alumnosModel.findOne({ _id: id }).populate("notas");
//       // if (!alumno) {
//       //   return res.json({ status: 404, message: `Alumno no encontrado` });
//       // }

//       // const result = alumno.notas.filter((nota) => nota.año == year && nota.clase === clase);
//       const result = await notasModel.find({ clase, año: year }).populate("id_alumno")
//       if(result.length > 0){
//         return res.json({
//           status: 200,
//           result,
//         });
//       }
//       else return res.json({
//         status: 404,
//         message: "No se encontraron notas"
//       })
      
//     } catch (error) {
//       return res.json({
//         status: 500,
//         message: "Error",
//         error,
//       });
//     }
//   }
// );

//Poner notas a un alumno
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const nota = req.body;
      const response = await notasModel.create(nota);
      const alumno = await alumnosModel.findById(response.id_alumno);
      alumno.notas.push(response._id);
      const update = await alumnosModel.findByIdAndUpdate(
        { _id: alumno._id },
        alumno
      );

      res.json({
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
  }
);

//Corregir las notas de un alumno
router.put(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
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
  }
);

//Borrar una nota
router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
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
  }
);



export default router;