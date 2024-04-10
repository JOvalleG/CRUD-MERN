import React, { useState, useEffect } from "react";


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
        fetch("http://localhost:4000/personas")
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
        fetch("http://localhost:4000/personas/" + id, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
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

    const [formularios, setFormularios] = useState([])
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('')
    const [municipios, setMunicipios] = useState([])
    const [variable, setVariable] = useState(0)

    const [json, setJson] = useState()

    const [members, setMembers] = useState([])

    const [cabeza, setCabeza] = useState({
        documento: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        edad: '',
        departamento: '',
        municipio: '',
        direccion: '',
    })

    const [direccion, setDireccion] = useState({
        via: '',
        primer_numero: '',
        cardinalidad: '',
        segundo_numero: '',
        tercer_numero: '',
    })


    const handleCabezaInput = (event) => {
        setCabeza({
          ...cabeza,
          [event.target.name]: event.target.value,
        });
      };

    const handleDireccionInput = (event) => {
        setDireccion({
            ...direccion,
             [event.target.name]: event.target.value,
        })

        const nuevaDireccion = Object.values({
            ...direccion,
            [event.target.name]: event.target.value,
        }).join(' ').toLowerCase().trim();

        setCabeza({
            ...cabeza,
            direccion: nuevaDireccion,
          });
    }

    const handleDepartamentoChange = (e) =>{
        const departamento = e.target.value;
        setDepartamentoSeleccionado(departamento)
        setCabeza({
            ...cabeza,
            departamento: departamento,
          });
    }

    function fetchMunicipios (depto){
        fetch(`http://localhost:4000/municipio/${depto}`)
       .then(response => {
            if(!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
       })
       .then(data => {
            console.log(data)
            setMunicipios(data)
        })
       .catch(error => console.log(error))
    }
    
    useEffect(() => fetchMunicipios(cabeza.departamento), [cabeza.departamento])

    const [member, setMember] = useState({
        documento: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        edad: '',
        departamento: '',
        municipio: '',
        direccion: '',
    })

    const [direccionMember, setDireccionMember] = useState({
        via: '',
        primer_numero: '',
        cardinalidad: '',
        segundo_numero: '',
        tercer_numero: '',
    })

    const [departamentoSeleccionadoM, setDepartamentoSeleccionadoM] = useState('')
    const [municipiosM, setMunicipiosM] = useState([])

    const handleDireccionMemberInput = (event) => {
        const { name, value } = event.target;
        setDireccionMember(prevDireccionMember => ({
            ...prevDireccionMember,
            [name]: value,
        }));
    
        const nuevaDireccion = Object.values({
            ...direccionMember,
            [name]: value,
        }).join(' ').toLowerCase().trim();
    
        setMember(prevMember => ({
            ...prevMember,
            direccion: nuevaDireccion,
        }));
    };

    const handleDepartamentoMemberChange = (e) => {
        const departamento = e.target.value;
        setDepartamentoSeleccionadoM(departamento);
        setMember(prevMember => ({
            ...prevMember,
            departamento: departamento,
        }));
    };

    useEffect(() => {console.log(member)},[member])


        const handleMemberInput = (event) => {
            setMember({
                ...member,
                [event.target.name]:  event.target.value
            })
        };

        const handleMemberSubmit = () => {
            setMembers([...members, member])
        }

    
    
//PRUEBA DEPARTAMENTOS
    
    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        // const persona = {
        //     documento: formData.get('documento'),
        //     edad: formData.get('edad'),
        //     primer_nombre: formData.get('primer_nombre'),
        //     segundo_nombre: formData.get('segundo_nombre'),
        //     primer_apellido: formData.get('primer_apellido'),
        //     segundo_apellido: formData.get('segundo_apellido'),
        //     direccion: formData.get('via') + ' ' + formData.get('primer_numero') + ' ' + formData.get('cardinalidad') + ' ' + formData.get('segundo_numero') + ' ' + formData.get('tercero_numero'),
        //     nombre_municipio: formData.get('nombre_municipio')
        // };
        
        const persona = {
            primer_nombre: formData.get('primer_nombre'),
            segundo_nombre: formData.get('segundo_nombre'),
            primer_apellido: formData.get('primer_apellido'),
            segundo_apellido: formData.get('segundo_apellido'),
            documento: formData.get('documento'),
            edad: formData.get('edad')
        };
        
        const vivienda = {
            nombre_municipio: formData.get('nombre_municipio'),
            direccion: formData.get('via') + ' ' + formData.get('primer_numero') + ' ' + formData.get('cardinalidad') + ' ' + formData.get('segundo_numero') + ' ' + formData.get('tercero_numero')
        };
        
        const persona2 = { persona: persona, vivienda: vivienda };

        //validacion
        if (!persona.documento || !persona.edad || !persona.primer_nombre || !persona.primer_apellido) {
            console.log("Todos los campos son requeridos");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Todos los campos son requeridos
                </div>
            )
            return;
        } 
        
        if (props.persona.id_persona) {
            // editar persona
            fetch("http://localhost:4000/personas/" + props.persona.id_persona, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(persona2)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ha ocurrido un error");
                }
                return response.json()
            })
            .then(data => props.showList())
            .catch((error) => console.log("Ha ocurrido un error", error)
            );
        }
        else {

        //crear nueva persona
        fetch("http://localhost:4000/personas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona2)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json()
        })
        .then(data => props.showList())
        .catch((error) => console.log("Ha ocurrido un error", error)
        );
        }
    }

    function handleSumit() {
        console.log(members)
        /*fetch("http://localhost:4000/familia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
        .then(response => {
            if (!response.ok) {
                console.log(response)
            }
            return response.json();
        })
        .then(data => props.showList())
        .catch(error => {
            console.error(error);
        })*/
    }
    
    
    
    return (
        <>
        <h2 className="text-center mb-3">{props.persona.id_persona ? "Editar persona" : "Crear una nueva persona"}</h2>

        {props.persona.id_persona && <div className="text-center row mt-3">
        <div className="col-lg-7 mx-auto">
            <h4>Documento de identidad</h4>
            <p>{props.persona.documento}</p>
        </div>
        </div>}

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
                
                {!props.persona.id_persona && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Documento de identidad*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="documento"
                        defaultValue={props.persona.documento} />
                    </div>
                </div>}

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Edad*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="edad"
                        defaultValue={props.persona.edad} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Primer nombre*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="primer_nombre"
                        defaultValue={props.persona.primer_nombre} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Segundo nombre</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="segundo_nombre"
                        defaultValue={props.persona.segundo_nombre} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Primer apellido*</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="primer_apellido"
                        defaultValue={props.persona.primer_apellido} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Segundo apellido</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="segundo_apellido"
                        defaultValue={props.persona.segundo_apellido} />
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
                                defaultValue={props.persona.nombre_municipio}
                                onChange={handleCabezaInput}>
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
                            <select className='form-select me-2' name='via' defaultValue={direccion.via} onChange={handleDireccionInput}>
                                <option value=""></option>
                                <option value="calle">Calle</option>
                                <option value="carrera">Carrera</option>
                                <option value="transversal">Transversar</option>
                                <option value="diagonal">Diagonal</option>
                            </select>
                            <input className='form-control me-2' 
                                name='primer_numero'
                                onChange={handleDireccionInput} />
                            <select className='form-select me-2' name='cardinalidad' onChange={handleDireccionInput}>
                                <option value="">Cardinaldad</option>
                                <option value="sur">Sur</option>
                                <option value="oriente">Oriente</option>
                            </select>
                            # 
                            <input className='form-control me-2' 
                                name='segundo_numero'
                                onChange={handleDireccionInput} />
                            - 
                            <input className='form-control' 
                                name='tercero_numero'
                                onChange={handleDireccionInput} />
                        </div>
                    </div>

                <div className="row">
                    <div className="offset-sm-4 col-sm-4 d-grid">
                        <button onClick={handleSumit} type="submit" className="btn btn-primary me-2">Crear</button>
                    </div>
                
                    <div className="col-sm-4 d-grid">
                        <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancelar</button>
                    </div>
                </div>

            </form>
            </div>
        </div>
        

        </>
    );
}