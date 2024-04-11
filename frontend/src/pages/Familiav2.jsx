import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Familia() {
  const [content, setContent] = useState(<FamiliaLista showForm={showForm} />);

  function showList() {
    setContent(<FamiliaLista showForm={showForm} />);
  }

  function showForm(familia) {
    setContent(<FamiliaForm familia={familia} showList={showList} />);
  }

  return <div className="container my-5">{content}</div>;
}

export default Familia;

function FamiliaLista(props) {
  const [familia, setfamilia] = useState([]);

  function fetchfamilias() {
    fetch("http://localhost:4000/familia")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ha ocurrido un error");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data)
        setfamilia(data);
      })
      .catch((error) => console.log("Ha ocurrido un error", error));
  }

  useEffect(() => fetchfamilias(), []);

  function deletefamilia(id_familia) {
    fetch("http://localhost:4000/familia/" + id_familia, {
      method: "DELETE",
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
          title: "<strong>¡Borrado correcto!</strong>",
          html: "<i>Se ha eliminado la familia con éxito</i>",
          icon: "success",
          timer: 4000,
        });
        return response.json();
      })
      .then((data) => fetchfamilias())
      .catch((error) => console.log("Ha ocurrido un error", error));
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de familias</h2>
      <button
        onClick={() => props.showForm({})}
        type="button"
        className="btn btn-primary me-2"
      >
        Crear
      </button>
      <button
        onClick={() => fetchfamilias()}
        type="button"
        className="btn btn-outline-primary me-2"
      >
        Refrescar
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>ID Familia</th>
            <th>Documento de cabeza de familia</th>
            <th>Nombre de cabeza de familia</th>
            <th>Apellido de cabeza de familia</th>
          </tr>
        </thead>
        <tbody>
          {familia.map((familia, index) => {
            return (
              <tr key={index}>
                <td>{familia.id_familia}</td>
                <td>{familia.documento}</td>
                <td>{familia.primer_nombre}</td>
                <td>{familia.primer_apellido}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(familia)}
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletefamilia(familia.id_familia)}
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function FamiliaForm(props) {
  const [miembros, setMiembros] = useState([]);
  const miembrosProps = [];
  const [miembrosEdit, setMiembrosEdit] = useState(miembrosProps);

  useEffect(() => {
    if (props.familia.miembros) {
      setMiembrosEdit(props.familia.miembros);
    }
  }, [props.familia.miembros]);

  const handleAgregarMiembro = () => {
    setMiembrosEdit([...miembrosEdit, ""]);
  };

  const handleChangeDocumentoMiembro = (index, value) => {
    const nuevosMiembros = [...miembrosEdit];
    nuevosMiembros[index] = value;
    setMiembrosEdit(nuevosMiembros);
  };

  const handleQuitarMiembro = (index) => {
    const nuevosMiembros = [...miembrosEdit];
    nuevosMiembros.splice(index, 1); // Elimina el elemento en la posición 'index'
    setMiembrosEdit(nuevosMiembros);
}

  const handleAgregarInput = () => {
    setMiembros([...miembros, ""]);
  };

  const handleQuitarInput = (index) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros.splice(index, 1);
    setMiembros(nuevosMiembros);
  };

  const handleChangeDocumento = (index, value) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros[index] = value;
    setMiembros(nuevosMiembros);
  };

  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const familia = Object.fromEntries(formData.entries());
    let data = {
      cabeza_familia: familia.documento_cabeza_familia,
    };

    if (miembros.length >= 0) {
      const miembrosArray = [
        { documento: familia.documento_cabeza_familia }, // Agregar el documento de la cabeza de familia como un miembro adicional
        ...miembros.map((miembro) => ({ documento: miembro })), // Mapear los miembros existentes
      ];

      data.family_members = { members: miembrosArray };
    }
    //validacion
    if (!familia.documento_cabeza_familia) {
      setErrorMessage(
        <div className="alert alert-warning" role="alert">
          Todos los campos son requeridos
        </div>
      );
      return;
    }
    if (props.familia.id_familia) {
      // editar familia
      fetch("http://localhost:4000/update_familia/" + props.familia.id_familia, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
            title: "<strong>¡Actualización correcta!</strong>",
            html: "<i>¡La Familia se ha actualizado correctamente!</i>",
            icon: "success",
            timer: 4000,
          });
          return response.json();
        })
        .then((data) => props.showList())
        .catch((error) => console.log("Ha ocurrido un error", error));
    } else {
      //crear nuevo familia
      fetch("http://localhost:4000/familia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
          if (!response.ok) {
            const message = await response.json();
            Swal.fire({
              title: "<strong>¡Actualización incorrecta!</strong>",
              html: `<i>${message.message}</i>`,
              icon: "error",
              timer: 4000,
            });
            throw new Error("Ha ocurrido un error");
          }
          Swal.fire({
            title: "<strong>¡Creación correcta!</strong>",
            html: "<i>¡La familia se ha registrado con éxito!</i>",
            icon: "success",
            timer: 4000,
          });
          return response.json();
        })
        .then((data) => props.showList())
        .catch((error) => console.log("Ha ocurrido un error", error));
    }
  }
  return (
    <>
      <h2 className="text-center mb-3">
        {props.familia.id_familia ? "Editar familia" : "Crear nuevo familia"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage}

          <form onSubmit={(event) => handleSubmit(event)}>
            {props.familia.id_familia && (
              <div className="row mb-3">
                <label className="col-sm-4 col-form-label">ID Familia</label>
                <div className="col-sm-8">
                  <input
                    readOnly
                    className="form-control-plaintext"
                    name="id_familia"
                    defaultValue={props.familia.id_familia}
                  />
                </div>
              </div>
            )}
            <div className="row mb-3">
                  <label className="col-sm-4 col-form-label">
                    Documento del cabeza de familia
                  </label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      name="documento_cabeza_familia"
                      defaultValue={props.familia.documento}
                    />
                  </div>
                </div>
            {props.familia.id_familia && (
              <>
                {miembrosEdit.map((miembro, index) => (
                  <div className="row mb-4" key={index}>
                    <label className="col-sm-4 col-form-label">
                      Documento del miembro {index + 1}
                    </label>
                    <div className="col-sm-4 d-grid">
                      <input
                        readOnly
                        className="form-control"
                        defaultValue={miembro.documento}
                        onChange={(e) =>
                            handleChangeDocumentoMiembro(index, e.target.value)
                        }
                      />
                    </div>
                    <div className="col-sm-2">
                      <button
                        type="button"
                        onClick={() => handleQuitarMiembro(index)}
                        className="btn btn-danger"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div className="row mb-3">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button
                  type="button"
                  onClick={handleAgregarInput}
                  className="btn btn-secondary me-2"
                >
                  Agregar nuevo familiar
                </button>
              </div>
            </div>

            {miembros.map((documento, index) => (
              <div className="row mb-4" key={index}>
                <label className="col-sm-4 col-form-label">
                  Documento del miembro {index + 1}
                </label>
                <div className="col-sm-4 d-grid">
                  <input
                    className="form-control"
                    value={documento}
                    onChange={(e) =>
                      handleChangeDocumento(index, e.target.value)
                    }
                  />
                </div>
                <div className="col-sm-2">
                  <button
                    type="button"
                    onClick={() => handleQuitarInput(index)}
                    className="btn btn-danger"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}

            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                {props.familia.id_familia ? (
                  <button type="submit" className="btn btn-primary me-2">
                    Editar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary me-2">
                    Crear
                  </button>
                )}
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  onClick={() => props.showList()}
                  type="button"
                  className="btn btn-secondary me-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
