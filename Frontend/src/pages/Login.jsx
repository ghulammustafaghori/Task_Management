import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/admin/adminLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUsername, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Save token in localStorage
      localStorage.setItem('token', data.token);
      

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-100 p-10 rounded-2xl bg-white shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <div className="mt-10">
          <label className="text-xl">Username or Email</label><br/>
          <input
            className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
            type="text"
            placeholder="Enter username or email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>

        <div className="mt-5">
          <label className="text-xl">Password</label><br/>
          <input
            className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 rounded-full px-10"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;