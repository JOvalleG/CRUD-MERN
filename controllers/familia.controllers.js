import { pool } from "../db.js";

export const get_families = async (req, res) => {
    try{
        const [families] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona INNER JOIN Familia ON Familia.id_cabeza_familia = Persona.id_persona"
        )
        res.json(families);
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const get_family = async (req, res) =>{
    try{
        
        family_result = check_familia(req.params.id);

        const [family_members] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona WHERE id_familia = ?",
            [family_result[0].id_familia]
        );

        const [cabeza_de_hogar] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona WHERE id_persona = ?",
            [family_result[0].id_cabeza_familia]
        );

        res.json({cabeza_de_hogar: cabeza_de_hogar[0], family_members : family_members});
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const create_family = async (req, res) => {
    try{
        const {cabeza_familia, family_members} = req.body;

        cabeza_familia.id_persona = check_persona(cabeza_familia.documento);

        const [result_family] = await pool.query(
            "INSERT INTO Familia(id_cabeza_familia) VALUES (?)", 
            [cabeza_familia.id_persona]
        );

        family_members.forEach( async (member) =>{
            member.id_persona = check_persona(member.documento);

            const [result_member] = await pool.query(
                "UPDATE Persona SET id_familia = ? WHERE id_persona = ?", 
                [result_family.id_familia, member.id_persona]
            );
        });

        res.json({message: "Familia creada con éxito"})

    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const delete_family = async (req, res) =>{
    try{

        const id_family = check_familia(req.params.id)[0].id_familia;

        const family_members = await pool.query(
            "UPDATE Persona SET NULL WHERE id_familia = ?",
            [id_family]
        );

        const family = await pool.query(
            "DELETE FROM Familia WHERE id_familia = ?",
            [id_family]
        );

        res.json({message: "Familia eliminada con éxito"});
        
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const update_family = async (req, res) => {
    try{
        const id_cabeza_familia = check_persona(req.body.documento);

        const [result_familia] = await pool.query(
            "UPDATE Familia SET id_cabeza_familia = ? WHERE id_familia = ?",
            [id_cabeza_familia, req.params.id]
        );

        const [result] = await pool.query(
            "UPDATE Persona SET id_familia = ? WHERE id_persona = ?",
            [req.params.id, id_cabeza_familia] 
        );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const add_family_member = async (req, res) => {
    try{
        const {family_member} = req.body;

        family_member.id_persona = check_persona(family_member.documento);
        family_member.id_familia = check_familia(family_member.documento_cabeza_familia)[0].id_familia;

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
    const [family_result] = await pool.query(
        "SELECT * FROM Familia WHERE id_cabeza_familia = (SELECT id_persona FROM Persona WHERE document = ?)",
        [familia_id]
    );

    if(family_result.length === 0){
            return res.status(404).json({message: 'Familia no encontrada.'})
    }
    return family_result;
}

const check_persona = async (persona_doc) => {
    const [persona_id] = await pool.query(
        "SELECT id_persona FROM Persona WHERE documento = ?",
        [persona_doc]
    );

    if(persona_id.length === 0){
        return res.status(404).json({message: 'La persona con documento '+persona_doc.toString()+' no se encuentra registrada'});
    }
    return persona_id[0].id_persona;
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