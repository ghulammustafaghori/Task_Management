import React from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerification from './pages/EmailVerification'

function App(){
  return(
   <div>
    {/* <h1 className="text-3xl font-bold underline">
      Home Page
    </h1> */}

    <Register />

    <div className='p-50'>
      <Link to='/login'>Login</Link> <br />
    <Link to='/emailVerification'>Email Verification</Link>
    </div>
  



    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/emailVerification' element={<EmailVerification />} />
    </Routes>

    
   </div>
  )
}

export default App