import { Router } from "express";
import { clasesModel } from "../../models/clases.model.js";
import { alumnosModel } from "../../models/alumnos.model.js";


//ver el SORT por apellido
const router = Router();

router.get("/", async (req, res) => {
  try {
    const clases = await clasesModel.find().distinct("nombre")
    return res.json(clases);
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//muestra todos los alumnos de la clase seleccionada
router.get("/:nombreClase/:year", async (req, res) => {
  try {
    const { nombreClase, year } = req.params;

    const clase = await clasesModel
      .findOne({ nombre: nombreClase, año: year })
      .populate("alumnos");

    if (!clase) {
      return res.json({ 
        status: 404, 
        message: "Clase no encontrada" });
    }

    if(!year){
      return res.json({
        status: 404,
        message: "Año no encontrado"
      })
    }
   

    const result = clase.alumnos;

    return res.json({
      status: 200,
      result});
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

//añadir la lista de alumno a una clase

router.get("/add/:nombreClase/:year", async (req, res) => {
  try {
    const { nombreClase, year } = req.params;

    const clase = await clasesModel
      .findOne({ nombre: nombreClase, año: year })
      .populate("alumnos");

    if (!clase) {
      return res.json({ message: "Clase no encontrada" });
    }

    const apellidoAlumno = req.query.apellido;
    const alumno = await alumnosModel.findOne({
      apellido: apellidoAlumno,
    });

    if(!alumno){
      return res.json({
        status: 404, 
        message: "alumno no encontrado"})
    }
    
    const alumnoRepetido = clase.alumnos.some(a => String(a._id) === String(alumno._id))
    if(alumnoRepetido){
      return res.json(
       { status: 500,
        message: 
        "El alumno ya está en la lista"})
    }
    
    clase.alumnos.push(alumno._id);

    const update = await clasesModel.findByIdAndUpdate(
      { _id: clase._id },
      clase
    );

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
});

router.post("/", async (req, res) => {
  try {
    const clase = req.body;
    const response = await clasesModel.create(clase);

    return res.json({
      Status: 200,
      Message: "Clase ingresada correctamente",
      response,
    });
  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});

export default router;
