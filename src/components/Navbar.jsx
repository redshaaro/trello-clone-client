import React, { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './ui/Modal';
import CreateBoardForm from './CreateBoardForm';

const Navbar = () => {
    const { dispatch, state } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const handleLogOut = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.clear();
        navigate("/login");
    };

    

    return (
        <>
            <nav className='flex justify-between items-center border-b-[0.5px] bg-white border-[#E6E8EB] p-2'>
                <div className="w-[20%] text-center">
                    <Link to="/">
                        <span className='text-[#172B4D] text-lg font-bold'>Trello</span>
                    </Link>
                </div>

                <div className="w-[60%] flex justify-center items-center gap-9">
                    <input className='w-full focus:outline-none border-[#99A3B2] border-[0.5px] p-2 rounded-sm' type="text" placeholder='Search for boards' />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-[#0C66E4] text-white p-2 rounded-sm cursor-pointer'
                    >
                        Create
                    </button>
                </div>

                <div className="w-[20%] flex justify-center items-center gap-3">
                    <NotificationsIcon className='text-[#99A3B2]' />
                    <AccountCircleIcon className='text-[#99A3B2]' />
                    <button className='cursor-pointer' onClick={handleLogOut}>LogOut</button>
                </div>
            </nav>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Create New Board</h2>
              <CreateBoardForm setIsModalOpen={setIsModalOpen} ></CreateBoardForm>
            </Modal>
        </>
    );
};

export default Navbar;
