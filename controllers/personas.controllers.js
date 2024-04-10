import { pool } from "../db.js";

export const get_personas = async (req, res) => {
  try {
    // Se hace la query que devuelva todos los datos de todas las personas en la base de datos.
    const [result] = await pool.query(
      "SELECT * FROM Persona INNER JOIN Vivienda ON Persona.id_vivienda = Vivienda.id_vivienda INNER JOIN Municipio ON Vivienda.id_municipio = Municipio.id_municipio"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const update_persona = async (req, res) => {
  try{
    // Actualiza los datos recibidos dentro del json persona
    const result = await pool.query(
      "UPDATE Persona SET ? WHERE id_persona = ?",
      [req.body.persona, req.params.id]
    );
    
    // Revisa si existe la persona en la base de datos, sino retorna informando que no existe.
    if(check_existence(res, result.affectedRows, "La persona no está registrada en la base de datos.") === false){
      return;
    }

    // Función para editar la información del hogar
    update_hogar(req, res, req.params.id);

    //Si existe retorna un mensaje de éxito al front.
    res.json({message : "Los datos de la persona con documento "+req.params.id.toString()+" han sido modificados."});
    
  }catch (error){
    return res.status(500).json({message : error.message});
  }
}

export const create_persona = async (req, res) => {
  console.log(req.body);
  try{
    // Se recibe el json del front
    const persona = req.body.persona;
    const vivienda = req.body.vivienda;

    // Se crea un registro con una nueva persona
    const [persona_result] = await pool.query(
      "INSERT INTO Persona(documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, edad) VALUES (?, ?, ?, ?, ?, ?)",
      [persona.documento, persona.primer_nombre, persona.segundo_nombre, persona.primer_apellido, persona.segundo_apellido, parseInt(persona.edad, 10)]
    );

    // Se busca la id de la nueva persona
    const [new_persona] = await pool.query(
      "SELECT id_persona FROM Persona WHERE documento = ?",
      [persona.documento]
    );

    // Revisar la información del hogar
    update_hogar(req, res, new_persona[0].id_persona);

  }catch (error){
    return res.status(500).json({message : error.message});
  }
}

const update_hogar = async (req, res, id_persona) => {
  try{
    //Usando el nombre del municipio buscamos su id en la base de datos
    var [id_municipio] = await pool.query(
      "SELECT id_municipio FROM Municipio WHERE nombre_municipio = ?",
      [req.body.vivienda.nombre_municipio]
    );

    //Se busca si existe una vivienda que tenga el minicipio y la dirección ingresada,
    //es decir, si la vivienda existe en la base de datos
    var [result_vivienda] = await pool.query(
      "SELECT * FROM Vivienda WHERE id_municipio = ? AND direccion = ?",
      [id_municipio[0].id_municipio, req.body.vivienda.direccion]
    );

    //Si no existe se crea la nueva vivienda
    if(check_existence(res, result_vivienda.length, "") === false){
      [result_vivienda] = await pool.query(
        "INSERT INTO Vivienda(id_municipio, direccion) VALUES (?, ?)",
        [id_municipio[0].id_municipio, req.body.vivienda.direccion]
      );

      // Se busca la id de la nueva casa creada
      const [new_vivienda] = await pool.query(
        "SELECT id_vivienda FROM Vivienda WHERE direccion = ?",
        [req.body.vivienda.direccion]
      );

      //Usando la id de la nueva vivienda creada, se modifica el id_vivienda dentro de persona
      var result_hogar_persona = await pool.query(
        "UPDATE Persona SET id_vivienda = ? WHERE id_persona = ?",
        [new_vivienda[0].id_vivienda, id_persona]
      );
      return;
    }

    //Si existe, se modifica el id_vivienda dentro de persona
    var result_hogar_persona = await pool.query(
      "UPDATE Persona SET id_vivienda = ? WHERE id_persona = ?",
      [result_vivienda[0].id_vivienda, id_persona]
    );
  }catch (error){
    return res.status(500).json({message : error.message});
  }
}

export const delete_persona = async (req, res) => {
  try{
    // Intenta eliminar la persona con la id_persona
    const [result] = await pool.query(
      "DELETE FROM Persona WHERE id_persona = ?",
      [req.params.id]
    );

    // Si no existe envía una notificación y retorna
    if(check_existence(res, result.affectedRows, "La persona no se encuentra registrada en la base de datos.")===false){
      return;
    }

    // Si existe envía un mensaje de éxito al front.
    res.json({message : "La persona ha sido eliminada con éxito."});
  }catch (error){
    return res.status(500).json({message : error.message});
  }
}

const check_existence = (res, result, message) => {
  if(result === 0){
    if(message.length >0){
      res.json({message: message});
    }
    return false;
  }
  return true;
}