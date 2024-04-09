import { Router } from "express";
import { 
    getPropietarios,
    getPropietario,
    createPropietario,
    eliminarPropietario,
    updatePropietario,
 } from "../controllers/propietario.controller.js";


const router = Router();

router.get("/propietario", getPropietarios);

router.get("/propietario/:id_vivienda", getPropietario);

router.post("/propietario", createPropietario);

router.delete("/propietario/:id_vivienda", eliminarPropietario);

router.put("/propietario/:id_vivienda", updatePropietario);

export default router;