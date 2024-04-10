import { pool } from "../db.js";

export const get_families = async (req, res) => {
    try{
        //Query selecciona el documento, nombre y apellido del cabeza de familia junto con la id de la familia
        const [families] = await pool.query(
            "SELECT documento, primer_nombre, primer_apellido, id_familia FROM Persona INNER JOIN Familia ON Familia.id_cabeza_familia = Persona.id_persona"
        )
        //Json con todas los resultados
        res.json(families);
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

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
    try{
        //recibir datos del front
        //family_members contiene los documentos de TODOS los miembros de la familia
        //incluido el cabeza de hogar
        const {cabeza_familia, family_members} = req.body;

        //Se verifica que la persona exista y se obtiene la id_persona
        cabeza_familia.id_persona = check_persona(cabeza_familia.documento);

        //Se crea una familia usando la id del cabeza de familia
        const [result_family] = await pool.query(
            "INSERT INTO Familia(id_cabeza_familia) VALUES (?)", 
            [cabeza_familia.id_persona]
        );

        
        family_members.forEach( async (member) =>{
            //Se verifica si existe el miembro y se obtiene la id_persona
            member.id_persona = check_persona(member.documento);

            //Para cada documento ingresado se actualiza el id_familia 
            const result_member = await pool.query(
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
        // se verifica si existe la familia y se obtiene su id
        const id_family = check_familia(req.params.id).id_familia;

        //Se actualiza id_familia a null para todos los miembros de una misma familia
        const family_members = await pool.query(
            "UPDATE Persona SET NULL WHERE id_familia = ?",
            [id_family]
        );

        //Se elimina la familia con la id_familia ingresada
        const [family] = await pool.query(
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
        // se checkea si existe una Persona con el documento del nuevo cabeza de familia
        const id_cabeza_familia = check_persona(req.body.documento);

        //Dada la id_cabeza_familia y la id_familia se actualiza con la nueva cabeza de familia
        const result_familia = await pool.query(
            "UPDATE Familia SET id_cabeza_familia = ? WHERE id_familia = ?",
            [id_cabeza_familia, req.params.id]
        );

        //Si es que el nuevo cabeza de familia no pertenecía a la familia, se ingresa a la familia
        const result = await pool.query(
            "UPDATE Persona SET id_familia = ? WHERE id_persona = ?",
            [req.params.id, id_cabeza_familia] 
        );
    }catch (error){
        return res.status(500).json({message: res.message});
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
        const result_member = await pool.query(
            "UPDATE Persona SET id_familia = ? WHERE id_persona = ?", 
            [family_member.id_familia, family_member.id_persona]
        );

        res.json({message: "Miembro añadido con éxito."});

    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const delete_family_member = async (req, res) => {
    try{
        //Dado el documento ingresado en la ruta se actualiza el id_familia
        const result = await pool.query(
        "UPDATE Persona SET id_familia = NULL WHERE documento = ?",
        [req.params.id]
      );
      
      if (result.affectedRows === 0){
        res.json({message: "Miembro no ha sido encontrado"})  
        return;
      }
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
            return res.status(404).json({message: 'La Familia no se encuentra registrada en la base de datos.'})
    }

    //Sino, devuelve id_familia e id_cabeza_familia
    return family_result[0];
}

const check_persona = async (persona_doc) => {
    //Se busca una persona con ese documento
    const [persona_id] = await pool.query(
        "SELECT id_persona FROM Persona WHERE documento = ?",
        [persona_doc]
    );

    //Si la cantidad de personas es cero, se retorna error
    if(persona_id.length === 0){
        return res.status(404).json({message: 'La persona con documento '+persona_doc.toString()+' no se encuentra registrada.'});
    }

    //Sino, se retorna el id de dicha persona
    return persona_id[0].id_persona;
}