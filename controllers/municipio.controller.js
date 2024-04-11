import { request } from "express";
import { pool } from "../db.js";

export const getMunicipios = async (req, res) => {
    try {
        // Consulta para obtener los datos de los municipios junto con la información del gobernador
        const [rows] = await pool.query(`
            SELECT Municipio.id_municipio, Municipio.nombre_municipio, Municipio.departamento, Municipio.id_gobernador, IFNULL(Persona.documento, NULL) AS documento
            FROM Municipio
            LEFT JOIN Persona ON Municipio.id_gobernador = Persona.id_persona
            `);

        // Organize the data into a JSON structure
        const municipiosData = rows.map(row => {
            return {
                id_municipio: row.id_municipio,
                nombre_municipio: row.nombre_municipio,
                departamento: row.departamento,
                id_gobernador: row.id_gobernador,
                documento: row.documento
            };
        });

        res.json(municipiosData); // Devuelve el resultado en el formato deseado
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

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
        if (req.body.documento === '') {
            console.log("aqui")
            await pool.query("UPDATE Municipio SET nombre_municipio = ?, departamento = ? WHERE id_municipio = ?",
            [
                req.body.nombre_municipio,
                req.body.departamento,
                req.params.id
            ]);
        } else {
            const gobernador = await pool.query("SELECT * FROM Persona WHERE documento = ?", [req.body.documento]);
            if (gobernador[0].length === 0) {
                return res.status(400).json({message: `No existe una persona con el documento ${req.body.documento}`});
            }
            const idPersonaGobernador = gobernador[0][0].id_persona;
            const municipioPersona = await pool.query("SELECT Vivienda.*, Persona.* FROM Vivienda INNER JOIN Persona ON Vivienda.id_vivienda = Persona.id_vivienda WHERE Persona.id_persona = ?", [idPersonaGobernador]);
            if(municipioPersona[0][0].id_municipio != req.params.id){
                return res.status(400).json({message:"La persona que se quiere añadir como gobernador no vive en el municipio."})
            }
        // Ahora puedes realizar la actualización del municipio utilizando el id_persona del gobernador
        await pool.query("UPDATE Municipio SET nombre_municipio = ?, departamento = ?, id_gobernador = ? WHERE id_municipio = ?",
            [
                req.body.nombre_municipio,
                req.body.departamento,
                idPersonaGobernador,
                req.params.id
            ]);
        }
        return res.status(200).json({message: "¡Registro de municipio actualizado exitosamente!"});
    } catch (error) {
        if (error.message === "Duplicate entry '1' for key 'municipio.id_gobernador'") {
            return res.status(400).json({message: "Ya existe un municipio con el mismo Gobernador"});
        }
        //return res.status(500).json({message: "El gobernador no existe o el documento ingresado no es válido"});
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

export const createMunicipio = async (req, res) => {
    try {
        const {nombre_municipio,departamento} = req.body;
        const id_persona = null;
        
        // Verificar si ya existe un municipio con el mismo nombre en el mismo departamento
        const existingMunicipio = await pool.query(
            'SELECT * FROM Municipio WHERE nombre_municipio = ? AND departamento = ?',
            [nombre_municipio, departamento]
        );
        if (existingMunicipio[0].length > 0) {
            return res.status(400).json({ message: `Ya existe el municipio ${nombre_municipio} en el departamento ${departamento}` });
        }

        await pool.query('INSERT INTO Municipio(nombre_municipio, departamento, id_gobernador) VALUES (?, ?, ?)',
                [
                    nombre_municipio,
                    departamento,
                    id_persona
                ])
        return res.json("¡Municipio registrado con éxito!");
            
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deleteMunicipio = async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM Municipio WHERE id_municipio = ?",
        [req.params.id]);
        if(result.affectedRows === 0){
            return res.status(404).json({message: "No existe el registro que se desea eliminar."});
        }
        return res.status(204).json({message: "¡Registro eliminado exitosamente!"});
    } catch (error) {
        return res.status(500).json({message: "Existen viviendas y personas asignadas a este municipio."})
    }
    
}