import React from 'react'
import VantaBackground from '../components/background/VantaBackground'
import LoginForm from '../components/LoginForm'

const Login = () => {
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