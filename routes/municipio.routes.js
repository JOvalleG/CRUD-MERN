import { Router } from "express";
import { getMunicipio,
    getMunicipios,
    updateMunicipio,
    getMunicipiosDepto,
    createMunicipio
 } from "../controllers/municipio.controller.js";

const router = Router();

router.get("/municipio", getMunicipios);

router.get("/municipio/:depto" , getMunicipiosDepto);

router.get("/municipio/:id", getMunicipio);

router.put("/municipio/:id", updateMunicipio);

router.post("/municipio", createMunicipio)


export default router;