import React, { useEffect } from 'react'
import VantaBackground from '../components/background/VantaBackground'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { state } = useAuth()
  console.log(state)
   
     useEffect(() => {
        if (state.token) {
          navigate("/");
        }
      }, [state.token, navigate]);
  return (

    <>
      <VantaBackground></VantaBackground>

      <div className='flex m-[50px] items-center justify-center h-[500px]  '>

        <LoginForm></LoginForm>
      </div>
    </>

  )
}

export default Login