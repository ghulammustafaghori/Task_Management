import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './Login'
import { API_URL } from '../api'
function Register() {
  const navigate = useNavigate();
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/user/addUser`,{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username,email,password})
    })
    .then((res)=>res.json())
    .then((data)=> {
      if (!data) {
        console.error('Error adding user:', data.message);
      }
      setName('');
      setEmail('');
      setPassword('');
      console.log('user added successfully')

      navigate('/emailVerification', { state: { email: email } });
      
      
      
    
    })
    .catch(err => console.error(err));
  };


    return (
       <div className="flex justify-center items-center h-screen bg-blue-100">
  <form onSubmit={handleSubmit} className="w-100 p-10 rounded-2xl bg-white shadow-lg">
    <h1 className="text-3xl font-bold text-center">Register</h1>

    <div className="mt-10">
      <label className="text-xl">Name</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="text"
        placeholder="Enter your name"
        onChange={(e)=>setName(e.target.value)}
        value={username || ''}
      />
    </div>

    <div className="mt-5">
      <label className="text-xl">Email</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="email"
        placeholder="Enter your email"
        onChange={(e)=>setEmail(e.target.value)}
        value={email || ''}
      />
    </div>

    <div className="mt-5">
      <label className="text-xl">Password</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
        type="password"
        placeholder="Enter your password"
        onChange={(e)=>setPassword(e.target.value)}
        value={password || ''}
      />
    </div>

    <div className="flex justify-between items-center mt-5">
  <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full">
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