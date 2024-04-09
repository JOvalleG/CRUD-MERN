import { Router } from "express";
import { 
    getViviendas,
    getVivienda,
    createVivienda,
    eliminarVivienda,
    updateVivienda
 } from "../controllers/vivienda.controller.js";


const router = Router();

router.get("/vivienda", getViviendas);

router.get("/vivienda/:id", getVivienda);

router.post("/vivienda/", createVivienda);

router.put("/vivienda/:id", updateVivienda);

router.delete("/vivienda/:id", eliminarVivienda);

export default router;