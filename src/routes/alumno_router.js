import { Router } from "express";
import { authorization, passportCall } from "../utils/utils.js";


const router = Router();


router.get("/", passportCall('jwt'), authorization("alumno"), (req, res) => {
    
    res.json({
        user: req.user
    })
})

export default router; 