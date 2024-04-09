import React, { useState, useEffect } from "react";


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
        fetch("http://localhost:4000/vivienda")
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
        fetch("http://localhost:4000/vivienda/" + id, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ha ocurrido un error");
            }
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

    const [errorMessage, setErrorMessage] = useState("");
    
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const vivienda = Object.fromEntries(formData.entries());
        
        //validacion
        if (!vivienda.nombre_municipio || !vivienda.direccion) {
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
        
        if (props.vivienda.id_vivienda) {
            // editar vivienda
            fetch("http://localhost:4000/vivienda/" + props.vivienda.id_vivienda, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vivienda)
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

        //crear nueva vivienda
        fetch("http://localhost:4000/vivienda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vivienda)
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
        <h2 className="text-center mb-3">{props.vivienda.id_vivienda ? "Editar vivienda" : "Crear una nueva vivienda"}</h2>


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
                
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Departamento</label>
                    <div className="col-sm-8">
                        <select className="form-select" name="departamento"
                        defaultValue="">

                            <option value="">Seleccione una opción</option>


                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Municipio</label>
                    <div className="col-sm-8">
                        <select className="form-select" name="municipio"
                        defaultValue={props.vivienda.nombre_municipio}>

                        <option value="x">Seleccione una opción</option>


                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Dirección</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="direccion"
                        defaultValue={props.vivienda.direccion} />
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