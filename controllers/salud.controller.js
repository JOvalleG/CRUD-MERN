import { request } from "express";
import { pool } from "../db.js";

export const getSalud = async (req, res) => {
    try {
        const [result] = await pool.query(
            "SELECT * FROM Salud"
        )
        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSaludPersona = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Salud WHERE id_salud = ?", [req.params.id]
        )
        const salud_data = result[0][0];
        const user_query = await pool.query('SELECT * FROM Persona WHERE id_persona = ?', [salud_data["id_persona"]]);
        const user = user_query[0][0]
        const data = {"salud_data":salud_data,"user_data":user}
        res.send(data);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createSalud = async (req, res) => {
    try {
        const {documento, tipo_cobertura, nombre_entidad, tipo_regimen} = req.body;
        const id_persona_query = await pool.query('SELECT id_persona FROM Persona WHERE documento = ?', [documento]);
        if (id_persona_query[0].length === 0) {
            return res.status(404).json({ message: "No existe una persona con el documento ingresado." });
        }else{
            const id_persona = id_persona_query[0][0]["id_persona"]
            
            const existingSaludInstance = await pool.query('SELECT id_persona FROM Salud WHERE id_persona = ?', [id_persona]);
            
            if (existingSaludInstance[0].length > 0) {
                return res.status(400).json({ message: "Esta persona ya está afiliada a una entidad." });
            }else{
                pool.query('INSERT INTO Salud(id_persona, tipo_cobertura, nombre_entidad, tipo_regimen) VALUES (?, ?, ?, ?)',
                [
                    id_persona,
                    tipo_cobertura,
                    nombre_entidad,
                    tipo_regimen
                ])
                return res.send("¡Afiliación a entidad de salud registrada con éxito!");
            }
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const updateSalud = async (req, res) => {
    try {
        const result = await pool.query("UPDATE Salud SET ? WHERE id_salud = ?",
        [
        req.body,
        req.params.id
        ]);
        return res.status(200).json({message: "¡Registro de afiliación actualizado exitosamente!"})
    } catch (error) {
        
    }
}

export const eliminarSalud = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM Salud WHERE id_salud = ?",
        [req.params.id]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "No existe el registro que se desea eliminar."});
        }
        return res.status(204).json({message: "¡Registro eliminado exitosamente!"});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}