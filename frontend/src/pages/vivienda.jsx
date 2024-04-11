import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'

function Vivienda() {
    const [content, setContent] = useState(<ViviendaLista showForm={showForm} />);
    
    function showList() {
        setContent(<ViviendaLista showForm={showForm} />);
    }

    function showForm(vivienda) {
        setContent(<ViviendaForm vivienda = {vivienda} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
    }

export default Vivienda

function ViviendaLista(props) {
    const [vivienda, setVivienda] = useState([]);

    function fetchVivienda() {
        fetch("https://lab-crud-v6r1.onrender.com/vivienda")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data)
            setVivienda(data);
        })
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    //fetchVivienda();
    useEffect(() => fetchVivienda(), []);

    function deleteVivienda(id) {
        fetch("https://lab-crud-v6r1.onrender.com/vivienda/" + id, {
            method: "DELETE"
        })
        .then(async response => {
            if (!response.ok) {
                const message = await response.json();
                    Swal.fire({
                        title:"<strong>¡Eliminación incorrecta!</strong>",
                        html: `<i>${message.message}</i>`,
                        icon: 'error',
                        timer: 5000
                    })
                throw new Error("Ha ocurrido un error");
            }
            Swal.fire({
                title:"<strong>¡Borrado exitoso!</strong>",
                html: "<i>Registro de vivienda eliminado exitosamente</i>",
                icon: 'success',
                timer: 4000
            })
            fetchVivienda()
            return response.json();
        })
        .then(data => fetchVivienda())
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    return (
        <>
        <h2 className="text-center mb-3">Lista de viviendas</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchVivienda()} type="button" className="btn btn-outline-primary me-2">Refrescar</button>
        <table className="table">
            <thead>
                <tr>
                    <th>id Vivienda</th>
                    <th>Nombre del municipio</th>
                    <th>Dirección de la vivienda</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {
                    vivienda.map((vivienda, index) => {
                        return (
                        <tr key={index}>
                            <td>{vivienda.id_vivienda}</td>
                            <td>{vivienda.nombre_municipio}</td>
                            <td>{vivienda.direccion}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button onClick={() => props.showForm(vivienda)} type="button" className="btn btn-primary btn-sm me-2">Editar</button>
                                <button onClick={() => deleteVivienda(vivienda.id_vivienda)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
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

function ViviendaForm(props) {

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
    


// PRUEBA MUNICIPIOS


    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const vivienda = {
            direccion: formData.get('via') + ' ' + formData.get('primer_numero') + ' ' + formData.get('cardinalidad') + ' ' + formData.get('segundo_numero') + ' ' + formData.get('tercero_numero'),
            nombre_municipio: formData.get('nombre_municipio')
        };
        //validacion
        if (!formData.get('via') || !formData.get('primer_numero') || !formData.get('segundo_numero') || !formData.get('tercero_numero')) {
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Todos los campos son requeridos
                </div>
            )
            return;
        } else {
            console.log("Creado con exito");
            setErrorMessage(
                <div className="alert alert-success" role="alert">
                    Creado con exito!
                </div>
            )
        }
        
        if (props.vivienda.id_vivienda) {
            // editar vivienda
            fetch("https://lab-crud-v6r1.onrender.com/vivienda/" + props.vivienda.id_vivienda, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vivienda)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ha ocurrido un error");
                }
                Swal.fire({
                    title:"<strong>¡Actualización correcta!</strong>",
                    html: "<i>¡La vivienda se ha actualizado exitosamente!</i>",
                    icon: 'success',
                    timer: 4000
                })
                props.showList()
                return response.json()
            })
            .then(data => props.showList())
            .catch((error) => console.log("Ha ocurrido un error", error)
            );
        }
        else {

        //crear nueva vivienda
        fetch("https://lab-crud-v6r1.onrender.com/vivienda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vivienda)
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
                html: "<i>¡Se ha creado la vivienda exitosamente!</i>",
                icon: 'success',
                timer: 4000
            })
            return response.json()
        })
        .then(data => props.showList())
        .catch((error) => console.log("Ha ocurrido un error", error)
        );
        }
    }
    function handleSumit() {
        console.log(members)
        /*fetch("https://lab-crud-v6r1.onrender.com/familia", {
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
        <h2 className="text-center mb-3">{props.vivienda.id_vivienda ? "Editar vivienda" : "Crear una nueva vivienda"}</h2>

        {props.vivienda.id_vivienda && <div className="text-center row mt-3">
        <div className="col-lg-7 mx-auto">
            <h4>Departamento</h4>
            <p>{props.vivienda.municipio}</p>
        </div>
        </div>}

        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {props.vivienda.id_vivienda && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">id</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id_vivienda"
                        defaultValue={props.vivienda.id_vivienda} />
                    </div>
                </div>}
                
                {!props.vivienda.id_vivienda && <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Departamento*</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='departamento'
                                defaultValue={props.vivienda.departamento}
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
                    </div>}

                    {!props.vivienda.id_vivienda && <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Municipio donde habita</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='nombre_municipio'
                                defaultValue={props.vivienda.nombre_municipio}
                                onChange={handleCabezaInput}>
                            <option value="">Selecciona un municipio</option>
                            {municipios.map((municipio, index) => (
                                <option key={index} value={municipio.nombre_municipio}>{municipio.nombre_municipio}</option>
                            ))}
                            </select>
                        </div>
                    </div>}

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
