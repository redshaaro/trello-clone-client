import React, { useEffect } from 'react'
import RegisterForm from '../components/RegisterForm'
import VantaBackground from '../components/background/VantaBackground'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate=useNavigate()
   const {state}=useAuth()
   
    
       useEffect(() => {
          if (state.token) {
            navigate("/");
          }
        }, [state.token, navigate]);
  return (
    <>

      <VantaBackground></VantaBackground>

      <div className='flex m-[50px] items-center justify-center h-[500px]  '>

        <RegisterForm></RegisterForm>
      </div>
    </>

  )
}

export default Register