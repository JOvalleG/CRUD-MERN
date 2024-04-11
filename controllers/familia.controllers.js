import { pool } from "../db.js";

export const get_families = async (req, res) => {
    try {
        // Consulta para obtener las familias junto con la información del cabeza de familia
        const [familiesRows] = await pool.query(
            "SELECT Persona.documento, Persona.primer_nombre, Persona.primer_apellido, Familia.id_familia FROM Familia LEFT JOIN Persona ON Familia.id_cabeza_familia = Persona.id_persona"
        );

        // Consulta para obtener los miembros asociados a cada familia
        const [membersRows] = await pool.query(
            "SELECT Persona.documento, Familia.id_familia FROM Persona LEFT JOIN Familia ON Persona.id_familia = Familia.id_familia WHERE Familia.id_familia IS NOT NULL AND Persona.documento != (SELECT documento FROM Persona WHERE Persona.id_persona = Familia.id_cabeza_familia)"
        );

        // Estructurar los resultados para incluir la información del cabeza de familia y los miembros
        const families = familiesRows.map(family => ({
            documento: family.documento,
            primer_nombre: family.primer_nombre,
            primer_apellido: family.primer_apellido,
            id_familia: family.id_familia,
            miembros: membersRows
                .filter(member => member.id_familia === family.id_familia)
                .map(member => ({ documento: member.documento }))
        }));
        
        // JSON con todas los resultados
        res.json(families);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const get_family = async (req, res) =>{
    try{
        //Se chequea si existe una familia que tenga un cabeza de familia con el documento ingresado en la ruta
        //Se retorna id_familia e id_cabeza_familia
        family_result = check_familia(req.params.id);

        //Se encuentran todos los miembros de la familia (incluyendo el cabeza de familia)
        const [family_members] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona WHERE id_familia = ?",
            [family_result.id_familia]
        );

        //Se encuentra el cabeza de familia
        const [cabeza_de_hogar] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona WHERE id_persona = ?",
            [family_result.id_cabeza_familia]
        );

        //Se retorna un json con el documento, primer nombre y apellido e id_familia para todos los miembros y separado el cabeza de hogar
        res.json({cabeza_de_hogar: cabeza_de_hogar[0], family_members : family_members});
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const create_family = async (req, res) => {
    try {
        const { cabeza_familia, family_members } = req.body;

        // Verificar que la persona con el documento del cabeza de familia exista y obtener su id_persona
        const [personaRows] = await pool.query(
            "SELECT id_persona FROM Persona WHERE documento = ?",
            [cabeza_familia]
        );

        if (personaRows.length === 0) {
            return res.status(404).json({ message: "No hay un cabeza de familia registrado con este documento." });
        }

        const id_persona = personaRows[0].id_persona;

        if (family_members && Array.isArray(family_members.members)) {
            for (const member of family_members.members) {
                const [personaRows] = await pool.query(
                    "SELECT id_persona FROM Persona WHERE documento = ?",
                    [member.documento]
                );

                const [personaRows_1] = await pool.query(
                    "SELECT id_cabeza_familia FROM Familia WHERE id_cabeza_familia = ?",
                    [personaRows[0].id_persona]
                );
                if (personaRows_1.length != 0) {
                    return res.status(404).json({ message: `La persona con el documento ${member.documento} ya es cabeza de familia.` });
                }
                if (personaRows.length === 0) {
                    return res.status(404).json({ message: `No hay una persona registrada con el documento ${member.documento}` });
                }
            }
        } else {
            // Manejar el caso en que family_members no tenga la estructura esperada
            return res.status(400).json({ message: "La propiedad 'family_members' debe ser un objeto con la propiedad 'members' que contenga un array." });
        }

        // Crear una nueva familia usando el id del cabeza de familia
        await pool.query(
            "INSERT INTO Familia(id_cabeza_familia) VALUES (?)",
            [id_persona]
        );

        // Obtener el id_familia recién insertado
        const [id_familia] = await pool.query("SELECT id_familia FROM Familia WHERE id_cabeza_familia = ?", [id_persona])

        // Verificar si family_members tiene la propiedad 'members' y es un array
        if (family_members && Array.isArray(family_members.members)) {
            // Iterar sobre los miembros dentro de family_members
            for (const member of family_members.members) {
                // Buscar el id_persona asociado con el documento
                const [personaRows] = await pool.query(
                    "SELECT id_persona FROM Persona WHERE documento = ?",
                    [member.documento]
                );

                if (personaRows.length === 0) {
                    return res.status(404).json({ message: `No hay una persona registrada con el documento ${member.documento}` });
                }

                const id_persona_miembro = personaRows[0].id_persona;

                // Actualizar el id_familia para el miembro
                await pool.query(
                    "UPDATE Persona SET id_familia = ? WHERE id_persona = ?",
                    [id_familia[0].id_familia, id_persona_miembro]
                );
            }
        } else {
            // Manejar el caso en que family_members no tenga la estructura esperada
            return res.status(400).json({ message: "La propiedad 'family_members' debe ser un objeto con la propiedad 'members' que contenga un array." });
        }

        res.status(201).json({ message: "¡Familia creada!" });
    } catch (error) {
        if (error.message.includes("Duplicate") && error.message.includes("id_cabeza_familia")) {
            return res.status(400).json({ message: "Ya existe una familia con este cabeza de familia." });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
};


export const delete_family = async (req, res) =>{
    try{
        // se verifica si existe la familia y se obtiene su id
        const [personaRows] = await pool.query(
            "SELECT id_familia FROM Familia WHERE id_familia = ?",
            [req.params.id]
        );

        if (personaRows.length === 0) {
            return res.status(404).json({ message: "No existe esta familia." });
        }

        const id_familia = personaRows[0].id_familia;
        //Se actualiza id_familia a null para todos los miembros de una misma familia
        await pool.query(
            "UPDATE Persona SET id_familia = NULL WHERE id_familia = ?",
            [id_familia]
        );

        //Se elimina la familia con la id_familia ingresada
        await pool.query(
            "DELETE FROM Familia WHERE id_familia = ?",
            [id_familia]
        );

        res.json({message: "Familia eliminada con éxito"});
        
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const update_family = async (req, res) => {
    try {
        const { cabeza_familia, family_members } = req.body;

        const [personaRows] = await pool.query(
            "SELECT id_persona FROM Persona WHERE documento = ?",
            [cabeza_familia]
        );

        console.log(personaRows)

        if (personaRows.length === 0) {
            return res.status(404).json({ message: "El documento de cabeza de familia no está registrado." });
        }

        const [personaRows_1] = await pool.query(
            "SELECT id_familia FROM Familia WHERE id_familia = ?",
            [req.params.id]
        );

        if (personaRows_1.length === 0) {
            return res.status(404).json({ message: "No existe esta familia." });
        }

        if (family_members && Array.isArray(family_members.members)) {
            for (const member of family_members.members) {
                const [personaRows] = await pool.query(
                    "SELECT id_persona FROM Persona WHERE documento = ?",
                    [member.documento]
                );

                if (personaRows.length === 0) {
                    return res.status(404).json({ message: `No hay una persona registrada con el documento ${member.documento}` });
                }
            }
        } else {
            // Manejar el caso en que family_members no tenga la estructura esperada
            return res.status(400).json({ message: "La propiedad 'family_members' debe ser un objeto con la propiedad 'members' que contenga un array." });
        }

        await delete_family_update(req);
        await create_family_update(req);
        res.status(201).json({ message: "¡Familia actualizada!" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const create_family_update = async (req) => {
    try {
        const { cabeza_familia, family_members } = req.body;
        // Verificar que la persona con el documento del cabeza de familia exista y obtener su id_persona
        const [personaRows] = await pool.query(
            "SELECT id_persona FROM Persona WHERE documento = ?",
            [cabeza_familia]
        );

        const id_persona = personaRows[0].id_persona;
        // Crear una nueva familia usando el id del cabeza de familia
        await pool.query(
            "UPDATE Familia SET id_cabeza_familia = ? WHERE id_familia = ?",
            [id_persona,req.params.id]
        );

        // Obtener el id_familia recién insertado
        const [id_familia] = await pool.query("SELECT id_familia FROM Familia WHERE id_cabeza_familia = ?", [id_persona])

        // Verificar si family_members tiene la propiedad 'members' y es un array
        if (family_members && Array.isArray(family_members.members)) {
            // Iterar sobre los miembros dentro de family_members
            for (const member of family_members.members) {
                // Buscar el id_persona asociado con el documento
                const [personaRows] = await pool.query(
                    "SELECT id_persona FROM Persona WHERE documento = ?",
                    [member.documento]
                );

                const id_persona_miembro = personaRows[0].id_persona;

                // Actualizar el id_familia para el miembro
                await pool.query(
                    "UPDATE Persona SET id_familia = ? WHERE id_persona = ?",
                    [id_familia[0].id_familia, id_persona_miembro]
                );
            }
        } 
    } catch (error) {
    }
};


export const delete_family_update = async (req) =>{
    try{
        // se verifica si existe la familia y se obtiene su id
        const [personaRows] = await pool.query(
            "SELECT id_familia FROM Familia WHERE id_familia = ?",
            [req.params.id]
        );

        const id_familia = personaRows[0].id_familia;
        //Se actualiza id_familia a null para todos los miembros de una misma familia
        await pool.query(
            "UPDATE Persona SET id_familia = NULL WHERE id_familia = ?",
            [id_familia]
        );

        //Se elimina el cabeza de familia
        await pool.query(
            "UPDATE Familia SET id_cabeza_familia = NULL WHERE id_familia = ?",
            [id_familia]
        );
    }catch (error){
        
    }
}

export const add_family_member = async (req, res) => {
    try{
        //se toma el json ingresado desde el front
        const {family_member} = req.body;

        //Se chequea si la persona y la familia existen
        family_member.id_persona = check_persona(family_member.documento);
        family_member.id_familia = check_familia(family_member.documento_cabeza_familia).id_familia;

        //Si existen, se actualiza el id_familia de la persona
        const [result_member] = await pool.query(
            "UPDATE Persona SET id_familia = ? WHERE id_persona = ?", 
            [family_member.id_familia, family_member.id_persona]
        );

        res.json({message: "Miembro añadido con éxito."})

    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const delete_family_member = async (req, res) => {
    try{
        //Dado el documento ingresado en la ruta se actualiza el id_familia
        const [result] = await pool.query(
        "UPDATE Persona SET id_familia = NULL WHERE documento = ?",
        [req.params.id]
      );
      res.json({message: "Miembro eliminado con Éxito"})
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

const check_familia = async (familia_id) =>{
    //Usando el documento del cabeza de familia se encuentra si existe alguna familia
    const [family_result] = await pool.query(
        "SELECT * FROM Familia WHERE id_cabeza_familia = (SELECT id_persona FROM Persona WHERE document = ?)",
        [familia_id]
    );

    //Si la respuesta es vacía retorna error
    if(family_result.length === 0){
            return res.status(404).json({message: 'Familia no encontrada.'})
    }

    //Sino, devuelve id_familia e id_cabeza_familia
    return family_result[0];
}

const check_persona = async (persona_doc) => {
    try {
        // Se busca una persona con ese documento
        const [persona_id] = await pool.query(
            "SELECT id_persona FROM Persona WHERE documento = ?",
            [persona_doc]
        );

        // Si la cantidad de personas es cero, se retorna error
        if (persona_id.length === 0) {
            return ('La persona con documento ' + persona_doc + ' no se encuentra registrada');
        }

        // Sino, se retorna el id de dicha persona
        return persona_id[0].id_persona;
    } catch (error) {
        // En caso de error, se maneja y se retorna un mensaje de error genérico
        console.error("Error al verificar la persona:", error);
        return ("Ocurrió un error al verificar la persona");
    }
}

//___________________________________
const check_vivienda = async (person) => {
    //Consultar si existe una casa que ya tenga la dirección de la persona en el municipio
    var [result_vivienda] = await pool.query(
        "SELECT id_vivienda FROM Vivienda WHERE direccion = ? and id_municipio = (SELECT id_municipio FROM Municipio WHERE nombre_municipio = ?)",
        [person.direccion, person.municipio]
    );

    //Si no existe una casa con esa información, se crea    
    if(result_vivienda.length === 0){
        var [result_vivienda] = await pool.query(
            "INSERT INTO Vivienda(id_municipio, direccion) VALUES ((SELECT id_municipio FROM Municipio WHERE nombre_municipio = ?) , ?)",
            [person.municipio, person.direccion]
        );
    }

    return result_vivienda[0].id_vivienda;
}

const create_person = async (req, res) =>{
    try{
        //El cabeza de familia y los miembros de la familia envía: 
        //documento, primer_nombre, segundo_nombre, primer_apellido, 
        //segundo_apellido, edad, municipio y dirección de vivienda

        //Recibir los datos entrantes de la persona cabeza de hogar y de cada miembro de la familia
        const {cabeza_de_hogar, family_members} = req.body;

        //Se asigna la id de la vivienda al cabeza de hogar
        cabeza_de_hogar.id_vivienda = check_vivienda(cabeza_de_hogar);
        
        // Se crea el registro de la persona cabeza de hogar dentro de la base de datos
        const [result_cabeza_de_hogar] = await pool.query(
            "INSERT INTO Persona(documento, primer_nombre," +
            "segundo_nombre, primer_apellido," + 
            "segundo_apellido, edad, id_vivienda)" + 
            "VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [cabeza_de_hogar.documento, cabeza_de_hogar.primer_nombre,
                cabeza_de_hogar.segundo_nombre, cabeza_de_hogar.primer_apellido,
                cabeza_de_hogar.segundo_apellido, cabeza_de_hogar.edad, 
                cabeza_de_hogar.id_vivienda]
         );
        
        //Se crea un nuevo registro de familia usando la id de la persona cabeza de hogar
        const [result_family] = await pool.query(
            "INSERT INTO Familia(id_cabeza_familia)" + 
            "VALUES (?)", 
            [result_cabeza_de_hogar.id_persona]
        );

        //Se añade la id de la familia dentro de la persona cabeza de hogar
        await pool.query(
            "ALTER Persona"
        )

        //Se realiza el mismo proceso para cada uno de los miembros de la familia
        family_members.members.forEach(async member => {
        //Se asigna la id de la vivienda a cada miembro
            member.id_vivienda = check_vivienda(member);

        // Se crea el registro para cada miembro de la familia
            var [member_result] = await pool.query(
                "INSERT INTO Persona(documento, primer_nombre," +
                "segundo_nombre, primer_apellido," + 
                "segundo_apellido, edad, id_vivienda, id_familia)" + 
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                [member.documento, member.primer_nombre,
                    member.segundo_nombre, member.primer_apellido,
                    member.segundo_apellido, member.edad, 
                    member.id_vivienda, result_family[0].id_familia]
            );
        });

        res.json({message: "Familia creada con éxito :)."});
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

const create_family_member = async (req, res) => {
    try{
        //Recibir la información del front
        const {cabeza_de_hogar, family_member} = req.body;

        //Se asigna la id de la vivienda a cada miembro
        family_member.id_vivienda = check_vivienda(family_member);

        //Consulta información de la familia del cabeza de hogar
        const [result_family] = await pool.query(
            "SELECT id_familia FROM Familia WHERE id_persona = (SELECT id_persona FROM Persona WHERE documento = ?)",
            [cabeza_de_hogar.documento]
        );

        // Se crea el registro para cada miembro de la familia
        const [member_result] = await pool.query(
            "INSERT INTO Persona(documento, primer_nombre," +
            "segundo_nombre, primer_apellido," + 
            "segundo_apellido, edad, id_vivienda, id_familia)" + 
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
            [family_member.documento, family_member.primer_nombre,
                family_member.segundo_nombre, family_member.primer_apellido,
                family_member.segundo_apellido, family_member.edad, 
                family_member.id_vivienda, result_family.id_familia]
        );

        res.json({message: "Miembro añadido con éxito :)."});
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}