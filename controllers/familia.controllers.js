import { pool } from "../db.js";

export const get_family = async (req, res) =>{
    try{
        const [result] = await pool.query(
        ""
      );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const create_family = async (req, res) =>{
    try{
        //El cabeza de familia y los miembros de la familia envía: 
        //documento, primer_nombre, segundo_nombre, primer_apellido, 
        //segundo_apellido, edad, municipio y dirección de vivienda

        //Recibir los datos entrantes de la persona cabeza de hogar y de cada miembro de la familia
        const {cabeza_de_hogar, family_members} = req.body;

        res.json({"cabeza" : cabeza_de_hogar.documento, "familia": family_members.members})
        return
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
            "INSERT INTO Familia(id_persona)" + 
            "VALUES (?)", 
            [result_cabeza_de_hogar.id_persona]
        );

        //Se añade la id de la familia dentro de la persona cabeza de hogar
        await pool.query(
//            "ALTER cabeza de hogar con la id de familia e id vivienda"
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
                    member.id_vivienda, result_family.id_familia]
            );
        });

        res.json({message: "Familia creada con éxito :)."});
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const delete_family = async (req, res) =>{
    try{
    
        const [result] = await pool.query(
        ""
      );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const update_family = async (req, res) => {
    try{
        const [result] = await pool.query(
        ""
      );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const create_family_member = async (req, res) => {
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

export const update_family_member = async (req, res) => {
    try{
        const [result] = await pool.query(
        ""
      );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

export const delete_family_member = async (req, res) => {
    try{
        const [result] = await pool.query(
        ""
      );
    }catch (error){
        return res.status(500).json({message: res.message});
    }
}

const check_vivienda = async (person) => {
    //Consultar si existe una casa que ya tenga la dirección de la persona en el municipio
    var [result_viviendar] = await pool.query(
        "SELECT id_vivienda FROM Vivienda WHERE direccion = ? and id_municipio = (SELECT id_municipio FROM Municipio WHERE nombre_municipio = ?)",
        [person.direccion, person.municipio]
    );

    //Si no existe una casa con esa información, se crea    
    if(!result_viviendar.id_vivienda){
        var [result_viviendar] = await pool.query(
            "INSERT INTO Vivienda(id_municipio, direccion) VALUES ((SELECT id_municipio FROM Municipio WHERE nombre_municipio = ?) , ?)",
            [person.municipio, person.direccion]
        );
    }

    return result_viviendar.id_vivienda
}