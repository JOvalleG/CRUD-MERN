import { Router } from "express";
import { getMunicipio,
    getMunicipios,
    updateMunicipio,
    getMunicipiosDepto,
    createMunicipio,
    deleteMunicipio
 } from "../controllers/municipio.controller.js";

const router = Router();

router.get("/municipio", getMunicipios);

router.get("/municipio/:depto" , getMunicipiosDepto);

router.get("/municipio/:id", getMunicipio);

router.put("/municipio/update/:id", updateMunicipio);

router.post("/municipio", createMunicipio)

router.delete("/municipio/:id", deleteMunicipio)


export default router;