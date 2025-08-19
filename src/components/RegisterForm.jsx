import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/RegisterationService'
import { useAuth } from "../context/AuthContext"

const RegisterForm = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuth();
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlesubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signup(username, password)
      
      localStorage.setItem("token", res.data.token)
      dispatch({ type: 'LOGIN', payload: { user: res.data.user, token: res.data.token } })
      navigate("/")
    } catch (err) {
      console.error("Registration failed", err)
      alert("Something went wrong while registering")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handlesubmit} 
      className='flex flex-col items-center gap-8 w-[400px] p-8 rounded-2xl shadow-xl 
                 bg-white/90 backdrop-blur-md border border-gray-200 transition duration-200'
    >
      <h2 className='text-center text-3xl font-bold text-[#172B4D] mb-2'>
        Create an Account
      </h2>
      <p className='text-gray-500 text-sm mb-4'>
        Sign up to start managing your boards
      </p>

      <div className='w-full flex flex-col gap-4'>
        <input 
          value={username}
          onChange={(e) => setUserName(e.target.value)} 
          className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition'
          type="text" 
          placeholder='Enter username' 
          required
        />
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition'
          type="password" 
          placeholder='Enter password' 
          required
        />
      </div>

      <button 
        type='submit' 
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C66E4] hover:bg-[#0957c3]"}`}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className='text-sm text-gray-600'>
        Already have an account?{" "}
        <Link to="/login" className='font-semibold text-[#0C66E4] hover:underline'>
          Login
        </Link>
      </div>
    </form>
  )
}

export default RegisterForm
