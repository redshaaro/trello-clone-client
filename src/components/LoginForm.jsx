import React from 'react'


const LoginForm = () => {
    return (
        <form className=' flex flex-col items-center gap-[150px]    h-full shadow-lg  rounded-md p-1 w-[400px] 
        bg-white/80 hover:bg-white/90 transition duration-200 backdrop-blur-sm
        border border-gray-300'>
            <div className='text-center mt-5 text-4xl text-[#172B4D]'>Login</div>
            <div className=' w-full flex flex-col items-center gap-4 p-3'>
                <input className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter username' />
                <input className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Please enter password' />
                <button className='w-full bg-[#0C66E4] text-[#FFFF] p-2 rounded-sm cursor-pointer' >
                    Login
                </button>

            </div>







        </form>
    )
}

export default LoginForm