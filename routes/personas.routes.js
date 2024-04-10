import { Router } from "express";
import { get_personas,
    get_persona,
    update_persona,
    create_persona,
    delete_persona
} from "../controllers/personas.controllers.js";

const router = Router();
// Muestra todas las personas en la base de datos.
// Retorna un json con un array de jsons con la información de cada persona
router.get("/personas", get_personas);

// Muestra una persona y toda su información en la base de datos. 
// [route] La id es  la id_persona en la base de datos.
// [GET] Retorna un json que tiene un json con llaves 'persona' y 'vivienda'.
router.get("/personas/:id", get_persona);

// Actualiza los datos personales de una persona, pero no su hogar. 
// [route] La id es  la id_persona en la base de datos.
// [POST] Recibe un json datos (json con los datos editables)
//
router.put("/personas/:id", update_persona);

// Elimina a la persona de la base de datos. 
// [route]La id la id_persona en la base de datos.
router.delete("/personas/:id", delete_persona); 

// Crea una persona en la base de datos.
// 
router.post("/personas", create_persona);  

export default router;