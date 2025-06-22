import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'


const RegisterForm = () => {
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()


    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:3000/api/auth/register", {
                username, password
            })
            navigate('/login')


        }

        catch (err) {
            console.log(err)
        }



    }


    return (
        <form onSubmit={handlesubmit} className=' flex flex-col items-center gap-[150px]    h-full shadow-lg  rounded-md p-1 w-[400px] 
        bg-white/80 hover:bg-white/90 transition duration-200 backdrop-blur-sm
        border border-gray-300'>
            <div className='text-center mt-5 text-4xl text-[#172B4D]'>Sign-up</div>
            <div className=' w-full flex flex-col items-center gap-4 p-3'>
                <input onChange={(e) => { setUserName(e.target.value) }} className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter username' />

                <input onChange={(e) => { setPassword(e.target.value) }} className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter password' />
                <div>Already have an account? <span className='font-bold text-[#0C66E4]'><Link to="/login">Login</Link></span> </div>

                <button type='submit' className='w-full bg-[#0C66E4] text-[#FFFF] p-2 rounded-sm cursor-pointer' >
                    Register
                </button>

            </div>







        </form>
    )
}

export default RegisterForm