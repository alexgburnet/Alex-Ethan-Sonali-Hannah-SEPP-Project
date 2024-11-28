import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Homepage from '../pages/Homepage.jsx';
import Navbar from '../Components/Navbar/Navbar.jsx';
import "./App.css"
function App() {

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product" element={<h1>product</h1>} />
        <Route path="/cart" element={<h1>cart</h1>} />
      </Routes>
    </div>
  )
}

export default App
