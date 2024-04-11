import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'

function Personas() {
    const [content, setContent] = useState(<PersonaLista showForm={showForm} />);
    
    function showList() {
        setContent(<PersonaLista showForm={showForm} />);
    }

    function showForm(persona) {
        setContent(<PersonaForm persona = {persona} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
    }
    
export default Personas

function PersonaLista(props) {
    const [persona, setPersona] = useState([]);

    function fetchPersona() {
        fetch("https://lab-crud-v6r1.onrender.com/personas")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data)
            setPersona(data);
        })
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    //fetchPersona();
    useEffect(() => fetchPersona(), []);

    function deletePersona(id) {
        fetch("https://lab-crud-v6r1.onrender.com/personas/" + id, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            Swal.fire({
                title: "<strong>¡Borrado correcto!</strong>",
                html: "<i>Se ha eliminado la persona con éxito</i>",
                icon: "success",
                timer: 4000,
              });
            return response.json();
        })
        .then(data => fetchPersona())
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    return (
        <>
        <h2 className="text-center mb-3">Lista de Personas</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchPersona()} type="button" className="btn btn-outline-primary me-2">Refrescar</button>
        <table className="table">
            <thead>
                <tr>
                    <th>id persona</th>
                    <th>Documento de identidad</th>
                    <th>Edad</th>
                    <th>Primer nombre</th>
                    <th>Segundo nombre</th>
                    <th>Primer apellido</th>
                    <th>Segundo apellido</th>
                    <th>Municipio</th>
                    <th>Direccion</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {
                    persona.map((persona, index) => {
                        return (
                        <tr key={index}>
                            <td>{persona.id_persona}</td>
                            <td>{persona.documento}</td>
                            <td>{persona.edad}</td>
                            <td>{persona.primer_nombre}</td>
                            <td>{persona.segundo_nombre}</td>
                            <td>{persona.primer_apellido}</td>
                            <td>{persona.segundo_apellido}</td>
                            <td>{persona.nombre_municipio}</td>
                            <td>{persona.direccion}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button onClick={() => props.showForm(persona)} type="button" className="btn btn-primary btn-sm me-2">Editar</button>
                                <button onClick={() => deletePersona(persona.id_persona)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
                            </td>
                        </tr>
                        
                        );
                    })
                }
            </tbody>
        </table>
        </>
    );
}

function PersonaForm(props) {
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(
        props.persona ? props.persona.departamento : ''
    )
    const [municipios, setMunicipios] = useState([])

    const [direccion, setDireccion] = useState(() => {
        const initialValores = {
        via: '',
        primer_numero: '',
        cardinalidad: '',
        segundo_numero: '',
        tercero_numero: '',
        };
        if (props.persona) {
            return {
                via: props.persona.direccion.split(" ")[0] || initialValores.via,
                primer_numero: props.persona.direccion.split(" ")[1] || initialValores.primer_numero,
                cardinalidad: props.persona.direccion.split(" ")[2] || initialValores.cardinalidad,
                segundo_numero: props.persona.direccion.split(" ")[3] || initialValores.segundo_numero,
                tercero_numero: props.persona.direccion.split(" ")[4] || initialValores.tercero_numero,
            }
        } else {
            return initialValores;
        }
    })
    const [valores, setValores] = useState(() => {
        const initialValores = {
            documento: '',
            edad: '',
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: ''
        };

        if (props.persona) {
            return {
                documento: props.persona.documento || initialValores.documento,
                edad: props.persona.edad || initialValores.edad,
                primer_nombre: props.persona.primer_nombre || initialValores.primer_nombre,
                segundo_nombre: props.persona.segundo_nombre || initialValores.segundo_nombre,
                primer_apellido: props.persona.primer_apellido || initialValores.primer_apellido,
                segundo_apellido: props.persona.segundo_apellido || initialValores.segundo_apellido
            };
        } else {
            return initialValores;
        }
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newValue = value.replace(/\s/g, ''); // Eliminar espacios en blanco
        setValores({ ...valores, [name]: newValue });
    };

    const handleDireccionInput = (event) => {
        const { name, value } = event.target;
        const newValue = value.replace(/\s/g, ''); // Eliminar espacios en blanco
        setDireccion({ ...direccion, [name]: newValue });
    }

    const handleDepartamentoChange = (e) =>{
        const departamento = e.target.value;
        setDepartamentoSeleccionado(departamento)
    }

    function fetchMunicipios (depto){
        fetch(`https://lab-crud-v6r1.onrender.com/municipio/${depto}`)
       .then(response => {
            if(!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
       })
       .then(data => {
            setMunicipios(data)
        })
       .catch(error => console.log(error))
    }
    
    useEffect(() => fetchMunicipios(departamentoSeleccionado), [departamentoSeleccionado])

//PRUEBA DEPARTAMENTOS
    
    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const persona = {
            primer_nombre: valores.primer_nombre,
            segundo_nombre: valores.segundo_nombre,
            primer_apellido: valores.primer_apellido,
            segundo_apellido: valores.segundo_apellido,
            documento: valores.documento,
            edad: valores.edad,
        };
        const via = direccion.via;
        const primer_numero = direccion.primer_numero;
        const cardinalidad = formData.get('cardinalidad');
        const segundo_numero = direccion.segundo_numero;
        const tercero_numero = direccion.tercero_numero;

        const vivienda = {
            nombre_municipio: formData.get('nombre_municipio'),
            direccion: via + ' ' + primer_numero + ' ' + cardinalidad + ' ' + segundo_numero + ' ' + tercero_numero
        };
        
        const persona2 = { persona: persona, vivienda: vivienda };
        
        
        //validacion
        if (!props.persona.id_persona) {
            if (!persona.documento || !persona.edad || !persona.primer_nombre || !persona.primer_apellido || !vivienda.nombre_municipio) {
                
                setErrorMessage(
                    <div className="alert alert-warning" role="alert">
                        Todos los campos con * son requeridos
                    </div>
                )
                return;
            }
        } else {
            if (!persona.edad || !persona.primer_nombre || !persona.primer_apellido || !vivienda.nombre_municipio) {
                //console.log(vivienda);
                setErrorMessage(
                    <div className="alert alert-warning" role="alert">
                        Todos los campos con * son requeridos
                    </div>
                )
                return;
            }
        }

        const edad = parseInt(persona.edad)
        if (isNaN(edad) || !Number.isInteger(edad) || edad < 0) {
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    La edad debe ser un número entero mayor o igual a cero.
                </div>
            );
            return;
        }
        
        if (props.persona.id_persona) {
            // editar persona
            fetch("https://lab-crud-v6r1.onrender.com/personas/" + props.persona.id_persona, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(persona2)
            })
            .then(async response => {
                if (!response.ok) {
                    const message = await response.json();
                    Swal.fire({
                        title:"<strong>¡Actualización incorrecta!</strong>",
                        html: `<i>${message.message}</i>`,
                        icon: 'error',
                        timer: 4000
                    })
                    throw new Error("Ha ocurrido un error");
                }
                Swal.fire({
                    title:"<strong>¡Actualización correcta!</strong>",
                    html: "<i>¡Se ha editado a la persona con éxito!</i>",
                    icon: 'success',
                    timer: 4000
                })
                return response.json()
            })
            .then(data => props.showList())
            .catch((error) => console.log("Ha ocurrido un error", error)
            );
        }
        else {

        //crear nueva persona
        fetch("https://lab-crud-v6r1.onrender.com/personas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona2)
        })
        .then(async response => {
            if (!response.ok) {
                const message = await response.json();
                    Swal.fire({
                        title:"<strong>¡Creación incorrecta!</strong>",
                        html: `<i>${message.message}</i>`,
                        icon: 'error',
                        timer: 4000
                    })
                throw new Error("Ha ocurrido un error");
            }
            Swal.fire({
                title:"<strong>¡Creación correcta!</strong>",
                html: "<i>¡Se ha creado a la persona con éxito!</i>",
                icon: 'success',
                timer: 4000
            });
            return response.json()
        })
        .then((data) => props.showList())
        .catch((error) => console.log("Ha ocurrido un error", error)
        );
        }
    }

    return (
        <>
        <h2 className="text-center mb-3">{props.persona.id_persona ? "Editar persona" : "Crear una nueva persona"}</h2>
        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {props.persona.id_persona && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">id</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id_persona"
                        defaultValue={props.persona.id_persona} />
                    </div>
                </div>}
                
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Documento de identidad*</label>
                        <div className="col-sm-8">
                        {props.persona.id_persona ? (
                        <input readOnly className="form-control-plaintext" name="documento" defaultValue={props.persona.documento} />
                        ) : (
                        <input className="form-control" name="documento" defaultValue={props.persona.documento} onChange={handleInputChange}/>
                        )}
                        </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Edad*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="edad"
                        defaultValue={props.persona.edad} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Primer nombre*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="primer_nombre"
                        defaultValue={props.persona.primer_nombre} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Segundo nombre</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="segundo_nombre"
                        defaultValue={props.persona.segundo_nombre} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Primer apellido*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="primer_apellido"
                        defaultValue={props.persona.primer_apellido} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Segundo apellido</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="segundo_apellido"
                        defaultValue={props.persona.segundo_apellido} onChange={handleInputChange}/>
                    </div>
                </div>

                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Departamento que habita*</label>
                    <div className='col-sm-8'>
                        <select className='form-select' 
                            name='departamento'
                            defaultValue={props.persona.departamento}
                            onChange={handleDepartamentoChange} >
                            <option value="">Selecciona un departamento</option>
                            <option value="Antioquia">Antioquia</option>
                            <option value="Atlántico">Atlántico</option>
                            <option value="Bolívar">Bolívar</option>
                            <option value="Bogotá">Bogotá</option>
                            <option value="Boyacá">Boyacá</option>
                            <option value="Caldas">Caldas</option>
                            <option value="Cauca">Cauca</option>
                            <option value="Cesar">Cesar</option>
                            <option value="Chocó">Chocó</option>
                            <option value="Córdoba">Córdoba</option>
                            <option value="Cundinamarca">Cundinamarca</option>
                            <option value="Huila">Huila</option>
                            <option value="La Guajira">La Guajira</option>
                            <option value="Magdalena">Magdalena</option>
                            <option value="Meta">Meta</option>
                            <option value="Nariño">Nariño</option>
                            <option value="Norte de Santander">Norte de Santander</option>
                            <option value="Quindío">Quindío</option>
                            <option value="Risaralda">Risaralda</option>
                            <option value="Santander">Santander</option>
                            <option value="Sucre">Sucre</option>
                            <option value="Tolima">Tolima</option>
                            <option value="Valle del Cauca">Valle del Cauca</option>
                        </select>
                    </div>
                </div>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Municipio donde habita*</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='nombre_municipio'
                                defaultValue={props.persona.nombre_municipio}>
                            <option value="">Selecciona un municipio</option>
                            {municipios.map((municipio, index) => (
                                <option key={index} value={municipio.nombre_municipio}>{municipio.nombre_municipio}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Dirección de residencia (dejar en blanco si no tiene)</label>
                        <div className='col-sm-8 d-flex align-items-center'>
                            <select className='form-select me-2' name='via' defaultValue={props.persona.direccion ? props.persona.direccion.split(" ")[0] : ""} onChange={handleDireccionInput}>
                                <option value=""></option>
                                <option value="calle">Calle</option>
                                <option value="carrera">Carrera</option>
                                <option value="transversal">Transversar</option>
                                <option value="diagonal">Diagonal</option>
                            </select>
                            <input className='form-control me-2' 
                                name='primer_numero'
                                defaultValue={props.persona.direccion ? props.persona.direccion.split(" ")[1] : ""}
                                onChange={handleDireccionInput} />
                            <select className='form-select me-2' name='cardinalidad' defaultValue={props.persona.direccion ? props.persona.direccion.split(" ")[2] : ""} onChange={handleDireccionInput}>
                                <option value="">Cardinaldad</option>
                                <option value="sur">Sur</option>
                                <option value="oriente">Oriente</option>
                            </select>
                            # 
                            <input className='form-control me-2' 
                                name='segundo_numero'
                                defaultValue={props.persona.direccion ? props.persona.direccion.split(" ")[3] : ""}
                                onChange={handleDireccionInput} />
                            - 
                            <input className='form-control' 
                                name='tercero_numero'
                                defaultValue={props.persona.direccion ? props.persona.direccion.split(" ")[4] : ""}
                                onChange={handleDireccionInput} />
                        </div>
                    </div>

                <div className="row">
                    <div className="col-sm-4 d-grid">
                        {props.persona.id_persona ? 
                        <button type="submit" className="btn btn-primary me-2">Editar</button>
                        : 
                        <button type="submit" className="btn btn-primary me-2">Crear</button>
                        }
                    </div>
                    <div className="offset-sm-4 col-sm-4 d-grid">
                    <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancelar</button>
                    </div>
                </div>

            </form>
            </div>
        </div>
        

        </>
    );
}