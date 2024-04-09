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
        const result = await pool.query("UPDATE Municipio SET ? WHERE id_municipio = ?",
        [
        req.body,
        req.params.id
        ]);
        return res.status(200).json({message: "¡Registro de municipio actualizado exitosamente!"})
    } catch (error) {
        
    }
}
