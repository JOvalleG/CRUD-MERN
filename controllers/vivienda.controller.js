import { request } from "express";
import { pool } from "../db.js";

export const getViviendas = async (req, res) => {
    try {
        const [result] = await pool.query(
            "SELECT Vivienda.*, Municipio.nombre_municipio AS nombre_municipio FROM Vivienda INNER JOIN Municipio ON Vivienda.id_municipio = Municipio.id_municipio;"
        )
        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getVivienda = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Vivienda WHERE id_vivienda = ?", [req.params.id]
        )
        const vivienda_data = result[0][0];
        const municipio_query = await pool.query('SELECT * FROM Municipio WHERE id_municipio = ?', [vivienda_data["id_municipio"]]);
        const municipio = municipio_query[0][0]
        const data = {"vivienda_data":vivienda_data,"municipio":municipio}
        res.send(data);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createVivienda = async (req, res) => {
    try {
        const {nombre_municipio, direccion} = req.body;
        console.log(req.body);
        //const direccion = `${req.body.via} ${req.body.primer_numero} ${req.body.cardinalidad} ${req.body.segundo_numero} ${req.body.tercero_numero}`;
        //console.log(direccion);
        const municipio_query = await pool.query('SELECT * FROM Municipio WHERE nombre_municipio = ?', [nombre_municipio]);
        const id_municipio = municipio_query[0][0]["id_municipio"]
         
        const existingViviendaInstance = await pool.query('SELECT id_vivienda FROM Vivienda WHERE direccion = ?', [direccion]);
            
        if (existingViviendaInstance[0].length > 0) {
                return res.status(400).json({ message: "Esta vivienda ya ha sido registrada." });
        }else{
            pool.query('INSERT INTO Vivienda(id_municipio, direccion) VALUES (?, ?)',
            [
                id_municipio,
                direccion
            ])
            return res.status(200).json({ message: "¡Vivienda registrada con éxito!" });
        }  
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const updateVivienda = async (req, res) => {
    //console.log(req.params.id);
    //console.log(req.body.direccion);
    try {
        const result = await pool.query("UPDATE Vivienda SET direccion = ? WHERE id_vivienda = ?",
        [
        req.body.direccion,
        req.params.id
        ]);
        return res.status(200).json({message: "¡Registro de vivienda actualizado exitosamente!"})
    } catch (error) {
        
    }
}


export const eliminarVivienda = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM Vivienda WHERE id_vivienda = ?",
        [req.params.id]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "No existe la vivienda que se desea eliminar."});
        }
        return res.status(204).json({message: "¡Registro de vivienda eliminado exitosamente!"});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}