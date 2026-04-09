import React from 'react'
import {useState} from 'react'
import { API_URL } from '../api'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState('');


  // Handle OTP verification
  const handleVerify = () => {
    fetch(`${API_URL}/api/users/verifyOtp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Email verified!');
        // redirect to login or dashboard
        navigate('/login');
      } else {
        console.error('Invalid OTP');
      }
    });
  };



    return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100 p-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
    {/* Title */}
    <h1 className="text-3xl font-bold text-center mb-6">Verify OTP</h1>

    {/* Email Info */}
    <div className="mb-6 text-center">
      <p className="text-gray-700">Verify Email for <span className="font-semibold">{email}</span></p>
    </div>

    {/* OTP Field */}
    <div className="mb-6">
      <label className="block text-xl font-medium mb-2">OTP</label>
      <input
        value={otp}
        onChange={e => setOtp(e.target.value)}
        className="w-full border border-gray-400 rounded-lg h-12 p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="Enter the OTP"
      />
    </div>

    {/* Verify Button */}
    <div>
      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-colors duration-200"
      >
        Verify OTP
      </button>
    </div>
  </div>
</div>
    )
}

export default EmailVerification