import { Router } from "express";
import { authorization, passportCall } from "../utils/utils.js";


const router = Router();


router.get("/", passportCall('jwt'), authorization(["admin","alumno"]), (req, res) => {
    console.log("rol:", req.user)
    res.json({
        user: req.user
    })
})

export default router; 