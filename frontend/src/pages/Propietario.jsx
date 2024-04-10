import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'

function Propietario() {
    const [content, setContent] = useState(<PropietarioLista showForm={showForm} />);
    
    function showList() {
        setContent(<PropietarioLista showForm={showForm} />);
    }

    function showForm(propietario) {
        setContent(<PropietarioForm propietario = {propietario} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
    }

export default Propietario

function PropietarioLista(props) {
    const [propietario, setPropietario] = useState([]);

    function fetchPropietarios() {
        fetch("http://localhost:4000/propietario")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data)
            setPropietario(data);
        })
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    useEffect(() => fetchPropietarios(), []);

    function deletePropietario(id_vivienda) {
        fetch("http://localhost:4000/propietario/" + id_vivienda, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            Swal.fire({
                title:"<strong>¡Borrado correcto!</strong>",
                html: "<i>Se ha eliminado el propietario con éxito</i>",
                icon: 'success',
                timer: 4000
            })
            return response.json();
        })
        .then(data => fetchPropietarios())
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    return (
        <>
        <h2 className="text-center mb-3">Lista de propietarios</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchPropietarios()} type="button" className="btn btn-outline-primary me-2">Refrescar</button>
        <table className="table">
            <thead>
                <tr>
                    <th>ID Vivienda</th>
                    <th>Documento_propietario</th>
                    <th>Departamento</th>
                    <th>Municipio</th>
                    <th>Dirección</th>
                </tr>
            </thead>
            <tbody>
                {
                    propietario.map((propietario, index) => {
                        return (
                        <tr key={index}>
                            <td>{propietario.id_vivienda}</td>
                            <td>{propietario.documento}</td>
                            <td>{propietario.departamento}</td>
                            <td>{propietario.nombre_municipio}</td>
                            <td>{propietario.direccion}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button onClick={() => props.showForm(propietario)} type="button" className="btn btn-primary btn-sm me-2">Editar</button>
                                <button onClick={() => deletePropietario(propietario.id_vivienda)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
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

function PropietarioForm(props) {

    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const propietario = Object.fromEntries(formData.entries());
        
        //validacion
        if (!propietario.documento) {
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Todos los campos son requeridos
                </div>
            )
            return;
        } else {
            Swal.fire({
                title:"<strong>No se pudo actualizar</strong>",
                html: "<i>No se pudo actualizar el propietario</i>",
                icon: 'error',
                timer: 4000
            })
        }
        
        if (props.propietario.id_vivienda) {
            // editar propietario
            fetch("http://localhost:4000/propietario/" + props.propietario.id_vivienda, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(propietario)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ha ocurrido un error");
                }
                Swal.fire({
                    title:"<strong>¡Actualización correcta!</strong>",
                    html: "<i>¡Registro de propietario actualizado exitosamente!</i>",
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

        //crear nuevo propietario
        fetch("http://localhost:4000/propietario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(propietario)
        })
        .then( async response => {
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
                title:"<strong>¡Creación correcta!</strong>",
                html: "<i>¡La persona ha sido registrada como propietaria de la vivienda!o</i>",
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
    return (
        <>
        <h2 className="text-center mb-3">{props.propietario.id_vivienda ? "Editar propietario" : "Crear nuevo propietario"}</h2>
        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {props.propietario.id_vivienda && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">ID de la propiedad</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id_vivienda"
                        defaultValue={props.propietario.id_vivienda} />
                    </div>
                </div>}

                {!props.propietario.id_vivienda && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">ID de la propiedad</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="id_vivienda"
                        defaultValue={props.propietario.id_vivienda} />
                    </div>
                </div>}

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Documento del nuevo propietario</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="documento"
                        defaultValue={props.propietario.documento} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-4 d-grid">
                        {props.propietario.id_vivienda ? 
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