import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/RegisterationService'
import { useAuth } from "../context/AuthContext"
import { handleInvitation } from '../services/BoardService'

const RegisterForm = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuth();
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validation checks
    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError("Email address is required for board invitations")
      return
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (e.g., user@example.com)")
      return
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    setLoading(true)
    try {
      const res = await signup(username, email, password)
      
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      dispatch({ type: 'LOGIN', payload: { user: res.data.user, token: res.data.token } })
      
      // Check for pending invitation
      const pendingInvitation = localStorage.getItem("pendingInvitation")
      if (pendingInvitation) {
        try {
          await handleInvitation("accept", pendingInvitation)
          localStorage.removeItem("pendingInvitation")
          alert("Account created and invitation accepted! Welcome to the board!")
        } catch (invErr) {
          console.error("Failed to accept invitation:", invErr)
        }
      }
      
      navigate("/")
    } catch (err) {
      console.error("Registration failed", err)
      const errorMessage = err.response?.data?.message
      
      // Provide specific error messages
      if (errorMessage?.includes("email") && errorMessage?.includes("exists")) {
        setError("This email is already registered. Please use a different email or login.")
      } else if (errorMessage?.includes("username") && errorMessage?.includes("exists")) {
        setError("This username is already taken. Please choose a different username.")
      } else {
        setError(errorMessage || "Something went wrong while registering. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handlesubmit} 
      className='flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[400px] mx-4 p-6 sm:p-8 rounded-2xl shadow-xl 
                 bg-white/90 backdrop-blur-md border border-gray-200 transition duration-200'
    >
      <h2 className='text-center text-2xl sm:text-3xl font-bold text-[#172B4D]'>
        Create an Account
      </h2>
      <p className='text-gray-500 text-xs sm:text-sm text-center -mt-2'>
        Sign up to start managing your boards
      </p>

      <div className='w-full flex flex-col gap-4'>
        <input 
          value={username}
          onChange={(e) => setUserName(e.target.value)} 
          className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition'
          type="text" 
          placeholder='Username' 
          required
          minLength={3}
        />
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition'
          type="email" 
          placeholder='Email address' 
          required
        />
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none 
                     focus:ring-2 focus:ring-[#0C66E4] transition'
          type="password" 
          placeholder='Password (min. 6 characters)' 
          required
          minLength={6}
        />
      </div>

      {error && (
        <div className='w-full bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <button 
        type='submit' 
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-semibold transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C66E4] hover:bg-[#0957c3]"}`}
      >
        {loading ? "Creating account..." : "Create Account"}
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
