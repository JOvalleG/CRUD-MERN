import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

import indexRoutes from "./routes/index.routes.js";
import personasRoutes from "./routes/personas.routes.js";
import saludRoutes from "./routes/salud.routes.js";
import viviendaRoutes from "./routes/vivienda.routes.js";
import municipioRoutes from "./routes/municipio.routes.js";
import propietarioRoutes from "./routes/propietarios.routes.js"
import familiaRoutes from "./routes/familia.routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)

app.use(cors());
app.use(express.json());

app.use(indexRoutes);
app.use(personasRoutes);
app.use(saludRoutes);
app.use(viviendaRoutes);
app.use(municipioRoutes);
app.use(propietarioRoutes);
app.use(familiaRoutes);


app.use(express.static(join(__dirname, './frontend/dist')))

app.listen(port);
console.log(`Server is listening on port ${port}`);