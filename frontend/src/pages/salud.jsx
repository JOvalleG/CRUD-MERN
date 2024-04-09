import React, { useState, useEffect } from "react";

function Salud() {
    const [content, setContent] = useState(<SaludLista showForm={showForm} />);
    
    function showList() {
        setContent(<SaludLista showForm={showForm} />);
    }

    function showForm(salud) {
        setContent(<SaludForm salud = {salud} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
}    
export default Salud


function SaludLista(props) {
    const [salud, setSalud] = useState([]);

    function fetchSalud() {
        fetch("http://localhost:4000/salud")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json();
        })
        .then(data => {
            //console.log(data)
            setSalud(data);
        })
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    //fetchSalud();
    useEffect(() => fetchSalud(), []);

    function deleteSalud(id) {
        fetch("http://localhost:4000/salud/" + id, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
            return response.json();
        })
        .then(data => fetchSalud())
        .catch((error) => console.log("Ha ocurrido un error", error));
    }

    return (
        <>
        <h2 className="text-center mb-3">Lista de usuarios del sistema de salud</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchSalud()} type="button" className="btn btn-outline-primary me-2">Refrescar</button>
        <table className="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Documento de identidad</th>
                    <th>Nombre entidad</th>
                    <th>Tipo de cobertura</th>
                    <th>Tipo de regimen</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {
                    salud.map((salud, index) => {
                        return (
                        <tr key={index}>
                            <td>{salud.id_salud}</td>
                            <td>{salud.documento}</td>
                            <td>{salud.nombre_entidad}</td>
                            <td>{salud.tipo_cobertura}</td>
                            <td>{salud.tipo_regimen}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button onClick={() => props.showForm(salud)} type="button" className="btn btn-primary btn-sm me-2">Editar</button>
                                <button onClick={() => deleteSalud(salud.id_salud)} type="button" className="btn btn-danger btn-sm">Eliminar</button>
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

function SaludForm(props) {

    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const salud = Object.fromEntries(formData.entries());
        
        //validacion
        if (!salud.nombre_entidad || !salud.tipo_cobertura || !salud.tipo_regimen ) {
            console.log("Todos los campos son requeridos");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Todos los campos son requeridos
                </div>
            )
            return;
        } 
        
        if (props.salud.id_salud) {
            // editar salud
            fetch("http://localhost:4000/salud/" + props.salud.id_salud, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(salud)
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

        //crear nueva salud
        fetch("http://localhost:4000/salud", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(salud)
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
        <h2 className="text-center mb-3">{props.salud.id_salud ? "Editar usuario del sistema de salud" : "Crear un nuevo usuario del sistema de salud"}</h2>

        <div className="text-center row mt-3">
        <div className="col-lg-7 mx-auto">
            <h4>Documento de identidad</h4>
            <p>{props.salud.documento}</p>
        </div>
        </div>

        <div className="text-center row mt-3">
        <div className="col-lg-7 mx-auto">
            <h4>Nombre del paciente</h4>
            <p>{props.salud.primer_nombre} {props.salud.primer_apellido}</p>
        </div>
        </div>
        
        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {props.salud.id_salud && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">id</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id_salud"
                        defaultValue={props.salud.id_salud} />
                    </div>
                </div>}

                {!props.salud.id_salud && <div className="row mb-3">
                <label className="col-sm-4 col-form-label">Documento de identidad</label>
                <div className="col-sm-8">
                    <input className="form-control" name="documento"
                    defaultValue={props.salud.documento} />
                </div>
                </div>}
                
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Nombre de la entidad</label>
                    <div className="col-sm-8">
                        <select className="form-select" name="nombre_entidad"
                        defaultValue={props.salud.nombre_entidad}>

                            <option value="">Seleccione una opción</option>
                            <option value="NuevaEPS">NuevaEPS</option>
                            <option value="Sura">Sura</option>
                            <option value="Sanitas">Sanitas</option>
                            <option value="Salud Total">Salud Total</option>
                            <option value="Medimás">Medimás</option>
                            <option value="Compensar">Compensar</option>
                            <option value="Famisanar">Famisanar</option>
                            <option value="Coosalud">Coosalud</option>
                            <option value="Coomeva">Coomeva</option>
                            <option value="Mutual Ser">Mutual Ser</option>

                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Tipo de cobertura</label>
                    <div className="col-sm-8">
                        <select className="form-select" name="tipo_cobertura"
                        defaultValue={props.salud.tipo_cobertura}>

                        <option value="x">Seleccione una opción</option>
                        <option value="Atencion Primaria">Atención Primaria</option>
                        <option value="Urgencias">Urgencias</option>
                        <option value="Hospitalizacion">Hospitalización</option>
                        <option value="Maternidad">Maternidad</option>
                        <option value="Medicamentos Formulados">Medicamentos Formulados</option>
                        <option value="Odontologia Basica">Odontología Básica</option>
                        <option value="Laboratorio Clinico">Laboratorio Clínico</option>
                        <option value="Cirugias No Cosmeticas">Cirugías No Cosméticas</option>
                        <option value="Consulta Especializada">Consulta Especializada</option>
                        <option value="Rehabilitacion">Rehabilitación</option>

                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Tipo de regimen</label>
                    <div className="col-sm-8">
                        <select className="form-select" name="tipo_regimen"
                        defaultValue={props.salud.tipo_regimen}>

                        <option value="">Seleccione una opción</option>
                        <option value="Contributivo">Régimen Contributivo</option>
                        <option value="Subsidiado">Régimen Subsidiado</option>

                        </select>
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