// src/routes/AppRoutes.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import EmailVerification from '../pages/EmailVerification'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import AddUser from '../pages/AddUser'
import EditUser from '../pages/EditUser'
import DeleteUser from '../pages/DeleteUser'
import UserDashboard from '../pages/user/Dashboard'
import ProtectedRoute from '../protectedRoutes/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/emailVerification" element={<EmailVerification />} />

      {/* Admin only routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>
      } />
      <Route path="/addUser" element={
        <ProtectedRoute allowedRole="admin"><AddUser /></ProtectedRoute>
      } />
      <Route path="/editUser/:id" element={
        <ProtectedRoute allowedRole="admin"><EditUser /></ProtectedRoute>
      } />
      <Route path="/deleteUser/:id" element={
        <ProtectedRoute allowedRole="admin"><DeleteUser /></ProtectedRoute>
      } />

      {/* User only routes */}
      <Route path="/userDashboard" element={
        <ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default AppRoutes