import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Salud from "./pages/salud";
import Vivienda from "./pages/vivienda";
import Personas from "./pages/personas";
//import Familias from "./pages/Familia";
import Familias from "./pages/Familiav2"
import Municipios from "./pages/Municipio";
import { Navbar, Footer } from "./components/layout";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/familia" element={<Familias />} />
        <Route path="/salud" element={<Salud />} />
        <Route path="/vivienda" element={<Vivienda />} />
        <Route path="/persona" element={<Personas />} />
        <Route path="/municipio" element={<Municipios />} />
      </Routes>
      <Footer />
    </>


  )
}

export default App
