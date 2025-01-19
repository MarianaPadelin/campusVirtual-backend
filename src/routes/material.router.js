import { Router } from "express";
import { loader } from "../utils/loader.js";


const router = Router();


//por ahora sube un único archivo, con la función single
router.post("/", loader.single('image'), async (req, res) => {
  try {
    const data = req.body
    console.log(data);
    if(!req.file){
        //res.status(404).json...
        return res.json({
            status:404,
            message: "No se encontró ningún archivo."
        })
    }

    console.log(req.file);
    res.json({
        status: 200,
        message:"Archivo cargado correctamente."
    })

  } catch (error) {
    return res.json({
      message: "Error",
      error,
    });
  }
});


export default router;
