import { Router } from "express";
import { get_personas,
    update_persona,
    create_persona,
    delete_persona
} from "../controllers/personas.controllers.js";

const router = Router();
// Muestra todas las personas en la base de datos.
// Retorna un json con un array de jsons con la información de cada persona
router.get("/personas", get_personas); //done

// Actualiza los datos personales de una persona, pero no su hogar. 
// [route] La id es  la id_persona en la base de datos.
// [POST] Recibe un json datos (json con los datos editables)
//
router.put("/personas/:id", update_persona);

// Elimina a la persona de la base de datos. 
// [route]La id la id_persona en la base de datos.
router.delete("/personas/:id", delete_persona); //done

// Crea una persona en la base de datos.
router.post("/personas", create_persona);  

export default router;