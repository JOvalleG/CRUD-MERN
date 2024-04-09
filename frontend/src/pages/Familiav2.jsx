import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function Familias() {
    const [content, setContent] = useState(<ListaFamilias showForm={showForm} />)
    function showList() {
        setContent(<ListaFamilias showForm={showForm}/>)
    }
    function showForm() {
        setContent(<FormularioFamilia showList={showList}/>)
    }
    return (
        <div className="container my-5">
            {content}
        </div>
    )
}

function ListaFamilias(props) {
    const [familias, setFamilias] = useState([])

    function fetchFamilias (){
        fetch('http://localhost:4000/familias')
       .then(response => {
            if(!response.ok) {
                console.log("error")
            }
            return response.json()
       })
       .then(data => {
            console.log(data)
            setFamilias(data)
        })
       .catch(error => console.log(error))
    }

    useEffect(() => fetchFamilias(), [])

    return (
        <>
        <h2 className='text-center mb-3'>Lista de familias</h2>
        <button onClick={() => props.showForm()} className="btn btn-primary me-2">Crear</button>
        <button onClick={() => fetchFamilias()} className="btn btn-outline-primary me-2">Refresh</button>
        <table className='table'>
            <thead>
                <tr>
                    <th>ID_familia</th>
                    <th>ID_cabeza_familia</th>
                </tr>
            </thead>
            <tbody>
                {
                    familias.map((familia, index) => (
                        <tr key={index}>
                            <td>{familia.id_persona}</td>
                            <td>{familia.primer_nombre}</td>
                            <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                <button type="button" className='btn btn-primary btn-sm me-2'>Editar</button>
                                <button type="button" className='btn btn-danger btn-sm'>Borrar</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </>
    )
}

function FormularioFamilia(props) {
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

    const agregarFormulario = () => {

        const handleMemberInput = (event) => {
            setMember({
                ...member,
                [event.target.name]:  event.target.value
            })
        };

        const handleMemberSubmit = () => {
            setMembers([...members, member])
        }

        const nuevoFormulario = (
            <div key={formularios.lenght}>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Documento de identidad*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='documento'
                                onChange={handleMemberInput}
                                 />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Edad*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='edad'
                                onChange={handleMemberInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Primer Nombre*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='primer_nombre'
                                onChange={handleMemberInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Segundo Nombre</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='segundo_nombre'
                                onChange={handleMemberInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Primer Apellido*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='primer_apellido'
                                onChange={handleMemberInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Segundo Apellido</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='segundo_apellido'
                                onChange={handleMemberInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Departamento que habita*</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='departamento'
                                defaultValue=""
                                onChange={handleDepartamentoMemberChange} >
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
                        <label className='col-sm-4 col-form-label'>Municipio donde habita</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='municipio'
                                onChange={handleMemberInput}>
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
                            <select className='form-select me-2' name='via' onChange={handleDireccionMemberInput}>
                                <option value=""></option>
                                <option value="calle">Calle</option>
                                <option value="carrera">Carrera</option>
                                <option value="transversal">Transversar</option>
                                <option value="diagonal">Diagonal</option>
                            </select>
                            <input className='form-control me-2' 
                                name='primer_numero'
                                onChange={handleDireccionMemberInput} />
                            <select className='form-select me-2' name='cardinalidad' onChange={handleDireccionMemberInput}>
                                <option value="">Cardinaldad</option>
                                <option value="sur">Sur</option>
                                <option value="oriente">Oriente</option>
                            </select>
                            # 
                            <input className='form-control me-2' 
                                name='segundo_numero'
                                onChange={handleDireccionMemberInput} />
                            - 
                            <input className='form-control' 
                                name='tercero_numero'
                                onChange={handleDireccionMemberInput} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-sm-4 col-sm-4 d-grid">
                            <button onClick={handleMemberSubmit} className="btn btn-primary btn-sm me-3">Guardar datos del integrante</button>
                        </div>
                    </div>
            </div>
        )
        setFormularios([...formularios, nuevoFormulario])
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
        <h2 className='text-center mb-3'>Crear nueva familia</h2>
        <div className='row'>
            <div className='col-lg-6 mx-auto'>
                <h3 className='text-center mb-3'>Datos del cabeza de familia</h3>
                <form>
                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Documento de identidad*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='documento'
                                onChange={handleCabezaInput}
                                 />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Edad*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='edad'
                                onChange={handleCabezaInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Primer Nombre*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='primer_nombre'
                                onChange={handleCabezaInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Segundo Nombre</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='segundo_nombre'
                                onChange={handleCabezaInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Primer Apellido*</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='primer_apellido'
                                onChange={handleCabezaInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Segundo Apellido</label>
                        <div className='col-sm-8'>
                            <input className='form-control' 
                                name='segundo_apellido'
                                onChange={handleCabezaInput} />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <label className='col-sm-4 col-form-label'>Departamento que habita*</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='departamento'
                                defaultValue=""
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
                        <label className='col-sm-4 col-form-label'>Municipio donde habita</label>
                        <div className='col-sm-8'>
                            <select className='form-select' 
                                name='municipio'
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
                            <select className='form-select me-2' name='via' onChange={handleDireccionInput}>
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
                </form>
                {
                    formularios.map((formulario, index) => (
                        <React.Fragment key={index}>
                            <h3 className='text-center mb-3'>Datos del familiar</h3>
                            {formulario}
                        </React.Fragment>
                    ))
                }
                <button className="btn btn-secondary me-2" onClick={agregarFormulario}>Agregar integrante</button>

                <div className='row justify-content-center mt-5'>
                    <div className='col-sm-4 d-grid'>
                        <button onClick={handleSumit} className='btn btn-primary btn-sm me-3'>Crear familia</button>
                    </div>
                    <div className='col-sm-4 d-grid'>
                        <button onClick={() => props.showList()} className="btn btn-secondary me-2">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Familias;