import { request } from "express";
import { pool } from "../db.js";

export const getMunicipios = async (req, res) => {
    try {
        const [result] = await pool.query(
            "SELECT * FROM Municipio"
        )
        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getMunicipio = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Municipio WHERE id_municipio = ?", [req.params.id]
        )
        const municipio_data = result[0][0];
        const gobernador_query = await pool.query('SELECT * FROM Persona WHERE id_persona = ?', [municipio_data["id_gobernador"]]);
        const gobernador = gobernador_query[0][0]
        const data = {"municipio_data":municipio_data,"gobernador_data":gobernador}
        res.send(data);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateMunicipio = async (req, res) => {
    try {
        // Primero, busca el id_persona utilizando el documento del gobernador
        const gobernador = await pool.query("SELECT id_persona FROM Persona WHERE documento = ?", [req.body.documento]);

        if (gobernador.length === 0) { // Si no se encuentra el gobernador
            return res.status(400).json({message: "El gobernador no existe"});
        }

        const idPersonaGobernador = gobernador[0].id_persona;
        console.log(req.body)

        // Ahora puedes realizar la actualización del municipio utilizando el id_persona del gobernador
        const result = await pool.query("UPDATE Municipio SET nombre_municipio = ? departamento = ? id_gobernador = ? WHERE id_municipio = ?",
            [
                req.body.nombre_municipio,
                req.body.departamento,
                idPersonaGobernador,
                req.params.id
            ]);

        return res.status(200).json({message: "¡Registro de municipio actualizado exitosamente!"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getMunicipiosDepto = async (req, res) => {
    try {
        const [result] = await pool.query(
            "SELECT nombre_municipio FROM Municipio WHERE departamento = ?", [req.params.depto]
        )
        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
