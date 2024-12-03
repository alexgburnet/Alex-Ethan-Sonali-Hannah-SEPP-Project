import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import Homepage from '../pages/Homepage/Homepage.jsx';
import Productpage from '../pages/Productpage/Productpage.jsx';
import Cart from '../pages/Cart/Cart.jsx';

// Components
import Navbar from '../Components/Navbar/Navbar.jsx';

import "./App.css"

function App() {

  return (
    <div className='screen'>
      <Navbar/>
      <div className='page-container'>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/product" element={<Productpage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
