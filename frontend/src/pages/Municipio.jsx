import React from "react";
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2'

function Municipios() {
    const [content, setContent] = useState(<ListaMunicipios showForm={showForm} />)
    function showList() {
        setContent(<ListaMunicipios showForm={showForm}/>)
    }
    function showForm(municipio) {
        setContent(<FormularioMunicipios municipio={municipio} showList={showList}/>)
    }
    return (
        <div className="container my-5">
            {content}
        </div>
    )
}

function ListaMunicipios(props) {
    const [municipios, setMunicipios] = useState([])
    const [municipioFiltrado, setMunicipioFiltrado] = useState('')
    const [depto, setDepto] = useState('')

    function fetchMunicipios (){
        fetch('http://localhost:4000/municipio')
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

    useEffect(() => {
        fetchMunicipios();
    }, []);

    const handleDeptoChange = (event) => {
        setDepto(event.target.value);
    };

    const busquedaDepto = (event) => {
        event.preventDefault()
        if (depto === ''){
            fetchMunicipios();
            return;
        }
        const municipiosFiltrados = municipios.filter(municipio => municipio.departamento === depto);
        setMunicipios(municipiosFiltrados)
    }

    const handleMunicipioChange = (event) => {
        setMunicipioFiltrado(event.target.value);
    };

    const busquedaMunicipio = (event) => {
        event.preventDefault()
        if (municipioFiltrado === ''){
            fetchMunicipios();
            return;
        }
        const municipiosFiltrados = municipios.filter(municipio => municipio.nombre_municipio === municipioFiltrado);
        setMunicipios(municipiosFiltrados)
    }

    return (
        <>
        <h2 className='text-center mb-3'>Lista de Municipios</h2>
        <button onClick={() => props.showForm({})} className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchMunicipios()} className="btn btn-outline-primary me-2">Refresh</button>
        <form className="d-flex" onSubmit={busquedaDepto}>
            <input className="form-control" placeholder="Buscar por departamento" value={depto} onChange={handleDeptoChange} />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
        </form>
        <form className="d-flex" onSubmit={busquedaMunicipio}>
            <input className="form-control" placeholder="Buscar por municipio" value={municipioFiltrado} onChange={handleMunicipioChange} />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
        </form>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Departamento</th>
                        <th>ID_Gobernador</th>
                        <th>Documento_Gobernador</th>
                    </tr>
                </thead>
                <tbody>
                    {municipios.map((municipio, index) => (
                        <tr key={index}>
                            <td>{municipio.id_municipio}</td>
                            <td>{municipio.nombre_municipio}</td>
                            <td>{municipio.departamento}</td>
                            <td>{municipio.id_gobernador}</td>
                            <td>{municipio.documento}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button onClick={() => props.showForm(municipio)} type="button" className='btn btn-primary btn-sm me-2'>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

function FormularioMunicipios(props){

    const [errorMessage, setErrorMessage] = useState("");

    function handleSumit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const municipio = Object.fromEntries(formData.entries())

        if (props.municipio.id_municipio) {

            //validacion
            if (!municipio.nombre_municipio || !municipio.departamento || !municipio.documento) {
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Todos los campos son requeridos
                </div>
            )
                return;
            }

            fetch("http://localhost:4000/municipio/" + props.municipio.id_municipio, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(municipio)
            })
            .then(async (response) => {
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
                        html: `<i>¡La persona ha sido registrada como propietaria de la vivienda!</i>`,
                        icon: 'success',
                        timer: 4000
                    })
                return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => console.log("aqui"))
        }
        else{

            //validacion
            if (!municipio.nombre_municipio || !municipio.departamento) {
                setErrorMessage(
                    <div className="alert alert-warning" role="alert">
                        Los campos de nombre y Departamento son obligatorios
                    </div>
                )
                    return;
                }

            //crear municipio
            fetch("http://localhost:4000/municipio/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(municipio)
            })
            .then(async (response) => {
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
                        html: `<i>¡La persona ha sido registrada como propietaria de la vivienda!</i>`,
                        icon: 'success',
                        timer: 4000
                    })
                return response.json()
            })
            .then((data) => props.showList())
            .catch((error) => console.log(error))
        }
    }
    return(
        <>
        <h2 className="text-center mb-3">{props.municipio.id_municipio ? "Editar municipio" : "Crear municipio"}</h2>
        <div className="row">
            <div className="col-lg-6 mx-auto">
            {errorMessage}
        <form onSubmit={(event) => handleSumit(event)}>
            {props.municipio.id_municipio && <div className="row mb-3">
                <label className="col-sm-4 col-form-label">id</label>
                <div className="col-sm-8">
                    <input readOnly className="form-control-plaintext" name="id_municipio"
                    defaultValue={props.municipio.id_municipio} />
                </div>
            </div>}
            <div className="row mb-3">
                <label className="col-sm-4 col-form-label">Nombre</label>
                <div className="col-sm-8">
                    <input className="form-control" name="nombre_municipio" defaultValue={props.municipio.nombre_municipio}/>
                </div>
            </div>
            <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Departamento</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='departamento'
                                defaultValue={props.municipio.departamento}>
                                <option value="">Selecciona...</option>
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
            <div className="row mb-3">
                <label className="col-sm-4 col-form-label">Documento del Gobernador</label>
                <div className="col-sm-8">
                    <input className="form-control" name="documento" defaultValue={props.municipio.documento}/>
                </div>
            </div>
            <div className="row">
                <div className="offset-sm-4 col-sm-4 d-grid">
                    <button type="submit" className="btn btn-primary btn-sm me-3">Actualizar</button>
                </div>
                <div className="col-sm-4 d-grid">
                    <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancelar</button>
                </div>
            </div>
        </form>
        </div>
        </div>
        </>
    )
}

export default Municipios;