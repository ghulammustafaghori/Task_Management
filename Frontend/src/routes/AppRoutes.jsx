// src/routes/AppRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import EmailVerification from '../pages/EmailVerification'
import Register from '../pages/Register'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/emailVerification' element={<EmailVerification />} />
    </Routes>
  )
}

export default AppRoutes