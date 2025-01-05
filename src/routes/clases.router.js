import { Router } from "express";
import { clasesModel } from "../../models/clases.model.js"


const router = Router();

router.get("/", async (req, res) => {
    try {
        const clases = await clasesModel.find();
        return res.json(clases);
    } catch (error) {
      return res.json({
        message: "Error",
        error,
      });
    }
})

router.post("/", async (req, res) => {
  try {
    const clase = req.body;
    const response = await clasesModel.create(clase)

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

export default router; 