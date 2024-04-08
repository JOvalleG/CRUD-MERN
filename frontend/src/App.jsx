import React from "react";
import {Routes, Route} from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Salud from "./pages/salud";
import Vivienda from "./pages/vivienda";
import Personas from "./pages/personas";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salud" element={<Salud />} />
        <Route path="/vivienda" element={<Vivienda />} />
        <Route path="/personas" element={<Personas />} />
      </Routes>
    </>


  )
}

export default App
