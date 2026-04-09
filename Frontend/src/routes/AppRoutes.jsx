// src/routes/AppRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import EmailVerification from '../pages/EmailVerification'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import AddUser from '../pages/AddUser'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/emailVerification' element={<EmailVerification />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/addUser' element={<AddUser />} />

    </Routes>
  )
}

export default AppRoutes