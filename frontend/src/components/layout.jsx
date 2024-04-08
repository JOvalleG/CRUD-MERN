import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary p-3" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          CRUD - Home
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/familia">
                Familia
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vivienda">
                Vivienda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/propietario">
                Propietario
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/municipio">
                Municipio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salud">
                Salud
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/persona">
                Personas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer >
      <div className="container p-3 mt-5 border-top">
        <small className="d-block text-muted text-center">2024 - CRUD</small>
      </div>
    </footer>
  )
}