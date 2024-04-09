import { Router } from "express";
import { 
    getPropietarios,
    getPropietario,
    createPropietario,
    eliminarPropietario,
 } from "../controllers/propietario.controller.js";


const router = Router();

router.get("/propietario", getPropietarios);

router.get("/propietario/:id_propietario/:id_vivienda", getPropietario);

router.post("/propietario", createPropietario);

router.delete("/propietario/:id_propietario/:id_vivienda", eliminarPropietario);

export default router;