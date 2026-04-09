function Login(){
  return(
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form className="w-100 p-10 rounded-2xl bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <div className="mt-10">
          <label className="text-xl">username or email</label><br/>
        <input className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100" type="text" placeholder="enter username or email" />
        </div>
        <div className="mt-5">
          <label className="text-xl">password</label><br/>
        <input className="border w-80 rounded-lg h-8 border-gray-400 p-2 bg-gray-100" type="password" placeholder="enter your password" />
        </div>
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 rounded-full px-10">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login