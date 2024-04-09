import { Router } from "express";
import {get_families,
        get_family,
        create_family,
        delete_family,
        update_family,
        add_family_member,
        delete_family_member,
 } from "../controllers/familia.controllers.js";

const familia_router = Router();

familia_router.get("/familia", get_families); //Mostrar todas las familias
familia_router.get("/familia/:id", get_family); //Mostrar integrantes de la familia
familia_router.post("/familia", create_family); //Crear familia completa
familia_router.delete("/familia/:id", delete_family); //Eliminar familia completa
familia_router.put("/update_familia/:id", update_family); //Cambiar cabeza de hogar en la familia
familia_router.post("/add_miembro_familia", add_family_member); //Crear un nuevo miembro en la familia
familia_router.delete("/delete_member/:id", delete_family_member); //Eliminar un miembro de la familia

export default familia_router;