import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"
import axios from 'axios';


const LoginForm = () => {
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const { dispatch } = useAuth();



    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                username, password
            })

            localStorage.setItem("token", res.data.token)
            dispatch({ type: 'LOGIN', payload: { user: res.data.user, token: res.data.token } });
            console.log(res)




        }

        catch (err) {
            console.error('Login failed', err);
            alert('Invalid credentials');
        }



    }
    
    return (
        <form onSubmit={handlesubmit} className=' flex flex-col items-center gap-[150px]    h-full shadow-lg  rounded-md p-1 w-[400px] 
        bg-white/80 hover:bg-white/90 transition duration-200 backdrop-blur-sm
        border border-gray-300'>
            <div className='text-center mt-5 text-4xl text-[#172B4D]'>Login</div>
            <div className=' w-full flex flex-col items-center gap-4 p-3'>
                <input onChange={(e) => { setUserName(e.target.value) }} className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter username' />
                <input onChange={(e) => { setPassword(e.target.value) }} className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter password' />
                <div>Don't have an account? <span className='font-bold text-[#0C66E4]'><Link to="/register">Register</Link></span> </div>

                <button type='submit' className='w-full bg-[#0C66E4] text-[#FFFF] p-2 rounded-sm cursor-pointer' >
                    Login
                </button>

            </div>







        </form>
    )
}

export default LoginForm