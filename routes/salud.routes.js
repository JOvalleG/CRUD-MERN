import { Router } from "express";
import { getSalud,
    createSalud,
    updateSalud,
    eliminarSalud,
    getSaludPersona
 } from "../controllers/salud.controller.js";

const router = Router();

router.get("/salud", getSalud);

router.get("/salud/:id", getSaludPersona);

router.post("/salud/", createSalud);

router.put("/salud/:id",updateSalud);

router.delete("/salud/:id", eliminarSalud);


export default router;