import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { dispatch, state } = useAuth()
    const navigate = useNavigate()
    const handleLogOut = () => {
        dispatch({ type: "LOGOUT" })
        localStorage.clear()
        navigate("/login")
        console.log(state)



    }
    console.log(state)
    return (
        <nav className='flex justify-between items-center border-b-[0.5px] bg-white border-[#E6E8EB] p-2 ' >
            {/* logo */}
            <div className="w-[20%] text-center">
                <Link to="/">
                    <span className='text-[#172B4D] text-lg font-bold'>   Trello</span>

                </Link>


            </div>
            {/* search and create button */}
            <div className="w-[60%]   flex justify-center items-center gap-9">

                <input className='w-[100%] focus:outline-none   border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='search for boards' />
                <button className='bg-[#0C66E4] text-[#FFFF] p-2 rounded-sm cursor-pointer'>Create</button>


            </div>

            {/* notifications and account settings */}
            <div className="w-[20%] flex justify-center  items-center gap-3 ">
                <div><NotificationsIcon className=' text-[#99A3B2]'></NotificationsIcon></div>
                <div><AccountCircleIcon className='text-[#99A3B2]'></AccountCircleIcon></div>
                <button className='cursor-pointer' onClick={() => { handleLogOut() }} >LogOut</button>

            </div>


        </nav>
    )
}

export default Navbar