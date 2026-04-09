// src/routes/AppRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import EmailVerification from '../pages/EmailVerification'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/emailVerification' element={<EmailVerification />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default AppRoutes