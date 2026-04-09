import React from 'react'

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

    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded-full px-10"
      >
        Register
      </button>
    </div>
  </form>
</div>
    )
}

export default Register