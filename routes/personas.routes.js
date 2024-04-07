import { Router } from "express";
import { getPersonas } from "../controllers/personas.controllers.js";

const router = Router();

router.get("/personas", getPersonas);


export default router;