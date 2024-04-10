import { request } from "express";
import { pool } from "../db.js";

export const getPropietarios = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Propietario.*, Persona.*, Vivienda.*, Municipio.*
            FROM Propietario
            LEFT JOIN Persona ON Propietario.id_persona = Persona.id_persona
            LEFT JOIN Vivienda ON Propietario.id_vivienda = Vivienda.id_vivienda
            LEFT JOIN Municipio ON Vivienda.id_municipio = Municipio.id_municipio
        `);

        // Organize the data into a JSON structure
        const propietariosData = rows.map(row => {
            return {
                persona: {
                    id_persona: row.id_persona,
                    documento: row.documento,
                    // Include other Persona fields as needed
                },
                vivienda: {
                    id_vivienda: row.id_vivienda,
                    direccion: row.direccion,
                    id_municipio: row.id_municipio,
                    nombre_municipio: row.nombre_municipio,
                    departamento: row.departamento
                    // Include other Vivienda fields as needed
                }
            };
        });

        // Send the JSON response
        res.json(propietariosData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getPropietario = async (req, res) => {
    try {
        const id_vivienda = req.params.id_vivienda;

        const [rows] = await pool.query(`
            SELECT Propietario.*, Persona.*, Vivienda.*, Municipio.*
            FROM Propietario
            LEFT JOIN Persona ON Propietario.id_persona = Persona.id_persona
            LEFT JOIN Vivienda ON Propietario.id_vivienda = Vivienda.id_vivienda
            LEFT JOIN Municipio ON Vivienda.id_municipio = Municipio.id_municipio
            WHERE Propietario.id_vivienda = ?
        `, [id_vivienda]);

        // If no rows found, return 404
        if (rows.length === 0) {
            return res.status(404).json({ message: "Propietario not found for the specified id_persona and id_vivienda" });
        }

        // Organize the data into a JSON structure
        const propietarioData = {
            // Include other Propietario fields as needed
            persona: {
                id_persona: rows[0].id_persona,
                documento: rows[0].documento,
                edad: rows[0].edad,
                primer_nombre: rows[0].primer_nombre,
                segundo_nombre: rows[0].segundo_nombre,
                primer_apellido: rows[0].primer_apellido,
                segundo_apellido: rows[0].segundo_apellido,
                // Include other Persona fields as needed
            },
            vivienda: {
                id_vivienda: rows[0].id_vivienda,
                direccion: rows[0].direccion,
                id_municipio: rows[0].id_municipio,
                nombre_municipio: rows[0].nombre_municipio,
                departamento: rows[0].departamento
                // Include other Vivienda fields as needed
            }
        };

        // Send the JSON response
        res.json(propietarioData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const createPropietario = async (req, res) => {
        try {
            const { documento, id_vivienda } = req.body;
    
            // Step 1: Retrieve id_persona from Persona table based on documento
            const [personaRows] = await pool.query(
                "SELECT id_persona FROM Persona WHERE documento = ?",
                [documento]
            );
    
            // Check if persona with provided documento exists
            if (personaRows.length === 0) {
                return res.status(404).json({ message: "No hay una persona registrada con este documento." });
            }
    
            const id_persona = personaRows[0].id_persona;
    
            // Step 2: Insert a new instance into the Propietario table
            await pool.query(
                "INSERT INTO Propietario (id_persona, id_vivienda) VALUES (?, ?)",
                [id_persona, id_vivienda]
            );
    
            // Send success response
            res.status(201).json({ message: "¡La persona ha sido registrada como propietaria de la vivienda!" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
}

export const eliminarPropietario = async (req, res) => {
    try {
        const {id_vivienda } = req.params; // Extracting parameters from route URL

        // Step 2: Check if there is a corresponding entry in the Propietario table
        const [propietarioRows] = await pool.query(
            "SELECT * FROM Propietario WHERE id_vivienda = ?",
            [id_vivienda]
        );

        // If no matching entry found in Propietario table, return 404
        if (propietarioRows.length === 0) {
            return res.status(404).json({ message: "No existen registros de propietarios con este documento y vivienda." });
        }

        // Step 3: Delete the entry from the Propietario table
        await pool.query(
            "DELETE FROM Propietario WHERE id_vivienda = ?",
            [id_propietario, id_vivienda]
        );

        // Send success response
        res.json({ message: "¡Propietario eliminado exitosamente!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updatePropietario = async (req, res) => {
    try {
        const {documento} = req.body;

        const [personaRows] = await pool.query(
            "SELECT id_persona FROM Persona WHERE documento = ?",
            [documento]
        );

        // Check if persona with provided documento exists
        if (personaRows.length === 0) {
            return res.status(404).json({ message: "No hay una persona registrada con este documento." });
        }

        const id_persona = personaRows[0].id_persona;
        const update = {"id_persona": id_persona};

        // Step 2: Insert a new instance into the Propietario table
        const result = await pool.query("UPDATE Propietario SET ? WHERE id_vivienda = ?",
        [
        update,
        req.params.id_vivienda
        ]);
        return res.status(200).json({message:"¡Registro de propietario actualizado exitosamente!"})
    } catch (error) {
        
    }
}