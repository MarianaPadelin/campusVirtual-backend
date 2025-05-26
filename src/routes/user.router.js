import { Router } from "express";
import { authorization, authMiddleware } from "../utils/utils.js";


const router = Router();


router.get(
  "/",
  authMiddleware,
  authorization(["admin", "alumno"]),
  (req, res) => {
    // console.log("ruta user: ", req.user)
    res.json({
      user: req.user,
    });
  }
);

export default router; 