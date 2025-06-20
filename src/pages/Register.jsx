import React from 'react'
import RegisterForm from '../components/RegisterForm'
import VantaBackground from '../components/background/VantaBackground'

const Register = () => {
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