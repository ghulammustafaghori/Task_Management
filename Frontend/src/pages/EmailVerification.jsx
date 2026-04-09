import React from 'react'

function EmailVerification() {
    return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
  <form className="w-100 p-10 rounded-2xl bg-white shadow-lg">
    <h1 className="text-3xl font-bold text-center">Verify OTP</h1>

    {/* Email Field */}
    <div className="mt-10">
      <label className="text-xl">Email</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-200"
        type="email"
        placeholder="Enter your email"
      />
    </div>

    {/* OTP Field */}
    <div className="mt-5">
      <label className="text-xl">OTP</label><br/>
      <input
        className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-200"
        type="text"
        placeholder="Enter the OTP"
      />
    </div>

    {/* Verify Button */}
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded-full px-10"
      >
        Verify OTP
      </button>
    </div>
  </form>
</div>
    )
}

export default EmailVerification