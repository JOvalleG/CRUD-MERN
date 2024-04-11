import React from 'react';

function Home() {
    return (
        <div className="container">
            <h1 className="text-center mt-5">Laboratorio CRUD</h1>
            <h2 className="text-center mb-4">Equipo Food Overflow</h2>
            <ul className="list-group mx-auto" style={{ maxWidth: '300px' }}>
                <li className="list-group-item">Andres Camilo Ardila</li>
                <li className="list-group-item">Gabriel Santiago Delgado</li>
                <li className="list-group-item">Jhon Sebastian Moreno</li>
                <li className="list-group-item">Juan Pablo Ovalle</li>
            </ul>
            <h4 className="text-center mt-4">Profesor: Hernando Rodríguez</h4>
        </div>
    );
}

export default Home;