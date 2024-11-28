import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<h1>home</h1>} />
        <Route path="/product" element={<h1>product</h1>} />
        <Route path="/cart" element={<h1>cart</h1>} />
      </Routes>
    </div>
  )
}

export default App
