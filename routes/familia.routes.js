import { Router } from "express";
import { get_family,
        create_family,
        delete_family,
        update_family,
        create_family_member,
        update_family_member,
        delete_family_member } from "../controllers/familia.controllers.js";

const familia_router = Router();

familia_router.get("/familia/:id", get_family); //Mostrar integrantes de la familia
familia_router.post("/familia", create_family); //Crear familia completa
familia_router.delete("/familia/:id", delete_family); //Eliminar familia completa
familia_router.post("/udate_familia/", update_family); //Cambiar cabeza de hogar en la familia
familia_router.post("/create_miembro_familia", create_family_member); //Crear un nuevo miembro en la familia
familia_router.post("/update_miembro_familia/", update_family_member); //Cambiar datos de un miembro de la familia
familia_router.delete("/familia/:id_member", delete_family_member); //Eliminar un miembro de la familia

export default familia_router;