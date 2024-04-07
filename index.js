import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

import indexRoutes from "./routes/index.routes.js";
import taskRoutes from "./routes/personas.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
//const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname)

app.use(cors());
app.use(express.json());

app.use(indexRoutes);
app.use(taskRoutes);

//app.use(express.static(join(__dirname, '../client/dist')))

app.listen(port);
console.log(`Server is listening on port ${port}`);