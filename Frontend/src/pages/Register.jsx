import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
function Register() {
    return (
       <div className="flex justify-center items-center h-screen bg-blue-100">
  <form className="w-100 p-10 rounded-2xl bg-white shadow-lg">
    <h1 className="text-3xl font-bold text-center">Register</h1>

    <div className="mt-10">
      <label className="text-xl">Name</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="text"
        placeholder="Enter your name"
      />
    </div>

    <div className="mt-5">
      <label className="text-xl">Email</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="email"
        placeholder="Enter your email"
      />
    </div>

    <div className="mt-5">
      <label className="text-xl">Password</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="password"
        placeholder="Enter your password"
      />
    </div>

    <div className="flex justify-between items-center mt-5">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full">
    Register
  </button>
  <Link to="/login" className="text-blue-500 font-bold hover:underline flex items-center h-full pr-2">
    Login
  </Link>
</div>
  </form>
</div>
    )
}

export default Register