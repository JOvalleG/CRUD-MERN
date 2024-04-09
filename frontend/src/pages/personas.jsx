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
        fetch("http://localhost:4000/persona")
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
        fetch("http://localhost:4000/persona/" + id, {
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

    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const persona = Object.fromEntries(formData.entries());
        
        //validacion
        if (!persona.nombre_municipio || !persona.direccion) {
            console.log("Todos los campos son requeridos");
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
        
        if (props.persona.id_persona) {
            // editar persona
            fetch("http://localhost:4000/persona/" + props.persona.id_persona, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(persona)
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
        fetch("http://localhost:4000/persona", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona)
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
                    <label className="col-sm-4 col-form-label">Documento de identidad</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="documento"
                        defaultValue={props.persona.documento} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Edad</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="edad"
                        defaultValue={props.persona.edad} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Primer nombre</label>
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
                    <label className="col-sm-4 col-form-label">Primer apellido</label>
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

                <div className="row">
                    <div className="offset-sm-4 col-sm-4 d-grid">
                        <button type="submit" className="btn btn-primary me-2">Crear</button>
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