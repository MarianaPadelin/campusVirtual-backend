import { Router } from "express";
import { clasesModel } from "../../models/clases.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";
import { authorization, passportCall } from "../utils/utils.js";

//ver el SORT por apellido
const router = Router();

//Muestra una lista con los nombres de todas las clases
router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const clases = await clasesModel.find().distinct("nombre");
      return res.json(clases);
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

router.get("/year/:year", passportCall("jwt"), authorization("admin"), async (req, res) => {
  try{
    const { year } = req.params; 

    const listaClases = await clasesModel.find({ año: year })

    if(!listaClases){
      return res.json({
        status: 404,
        message: "No hay clases registradas para el año" + year
      })
    }

    return res.json({
      status: 200,
      listaClases
    })
  }catch (error){
     return res.json({
       message: "Error",
       error,
     });
  }
});
//Ver las clases en las que está instripto ese alumno en ese año
router.get(
  "/alumno/:idAlumno/:year",
  passportCall("jwt"),
  authorization("alumno"),
  async (req, res) => {
    try {
      const { idAlumno, year } = req.params;

      const clases = await clasesModel.find({ alumnos: idAlumno, año: year })

      if(!clases){
        return res.json({
          status: 404,
          message: "No se encontraron clases para este año"
        })
      }

      const nombreClases = [];

      clases.map((clase) => (
        nombreClases.push(clase.nombre)
      ))

      console.log(nombreClases)
      return res.json({
        status: 200,
        nombreClases
      })
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//muestra todos los alumnos de la clase seleccionada
router.get(
  "/admin/:nombreClase/:year",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { nombreClase, year } = req.params;

      const clase = await clasesModel
        .findOne({ nombre: nombreClase, año: year })
        .populate("alumnos");

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

      const result = clase.alumnos;

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

//añadir alumno a una clase

router.post(
  "/add",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { nombreClase, año, nombre, apellido } = req.body;
      console.log(nombreClase, año, nombre, apellido);
      const clase = await clasesModel
        .findOne({ nombre: nombreClase, año: año })
        .populate("alumnos");

      if (!clase) {
        return res.json({ message: "Clase no encontrada" });
      }

      const alumno = await alumnosModel.findOne({
        nombre: nombre,
        apellido: apellido,
      });

      if (!alumno) {
        return res.json({
          status: 404,
          message: "alumno no encontrado",
        });
      }

      const alumnoRepetido = clase.alumnos.some(
        (a) => String(a._id) === String(alumno._id)
      );
      if (alumnoRepetido) {
        return res.json({
          status: 500,
          message: "El alumno ya está en la lista",
        });
      }

      clase.alumnos.push(alumno._id);

      const update = await clasesModel.findByIdAndUpdate(
        { _id: clase._id },
        clase
      );

      //además, setear las faltas en 0

      return res.json({
        status: 200,
        Message: "Lista generada correctamente",
        update,
      });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Agregar una nueva clase, si ya existe el id, modificarla
router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const clase = req.body;
      console.log(clase)
      const year = clase.año;
      const name = clase.nombre;

      const claseExists = await clasesModel.findOne({
        nombre: name,
        año: year,
      });
      if (claseExists) {
        console.log("llego al modificador")
        const claseModificada = await clasesModel.updateOne(
          { _id: claseExists._id }, 
          clase
        )
        return res.json({
          status: 201,
          message: "Clase modificada con éxito"
        })
      }

      const response = await clasesModel.create(clase);

      return res.json({
        status: 200,
        message: "Clase ingresada correctamente",
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

// Eliminar a un alumno de una clase
router.delete(
  "/:nombreClase/:year/:id",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const { nombreClase, year, id } = req.params;

      const clase = await clasesModel
        .findOne({ nombre: nombreClase, año: year })
        .populate("alumnos");

      if (!clase) {
        return res.json({ message: "Clase no encontrada" });
      }

      // Use Mongoose's ObjectId to compare properly
      // const ObjectId = mongoose.Types.ObjectId;
      const index = clase.alumnos.findIndex(
        (alumno) => alumno._id.toString() === id
      );

      if (index > -1) {
        // Remove the student from the array
        clase.alumnos.splice(index, 1);

        // Save the updated class
        await clase.save();

        return res.json({
          message: "Alumno eliminado de la clase correctamente",
          clase,
        });
      }

      return res.json({ message: "Alumno no encontrado en la clase" });
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
  }
);

//Eliminar una clase 

router.delete("/clase/:id",   passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try{
      const { id } = req.params;

      const clase = await clasesModel.findByIdAndDelete(id);
      if(!clase){
        return res.json({
          status: 404, 
          message: "No se encontró la clase"
        })
      }
      return res.json({
        status: 200, 
        message: "Clase eliminada"
      })

    }catch(error){
      return res.json({
        message: "Error",
        error,
      });
    }
  })

export default router;
