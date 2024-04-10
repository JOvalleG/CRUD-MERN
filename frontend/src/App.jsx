import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Salud from "./pages/salud";
import Vivienda from "./pages/vivienda";
import Personas from "./pages/personas";
//import Familias from "./pages/Familia";
import Familia from "./pages/Familiav2"
import Municipios from "./pages/Municipio";
import Propietario from "./pages/Propietario";
import { Navbar, Footer } from "./components/layout";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client/familia" element={<Familia />} />
        <Route path="/client/salud" element={<Salud />} />
        <Route path="/client/vivienda" element={<Vivienda />} />
        <Route path="/client/persona" element={<Personas />} />
        <Route path="/client/municipio" element={<Municipios />} />
        <Route path="/client/propietario" element={<Propietario />} />
      </Routes>
      <Footer />
    </>


  )
}

export default App
