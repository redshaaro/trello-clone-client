import React, { useEffect, useState } from 'react';
import VantaBackground from '../components/background/VantaBackground';
import image1 from "../assets/random/image1.jpeg";

import HomeBoard from '../components/HomeBoard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchboards } from '../services/BoardService';
import { useApp } from '../context/AppContext';



const Home = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
console.log(state.user?.username);
  
   
  const { boards, setBoards } = useApp()

  useEffect(() => {
    getData()
  }, [state.token])

  useEffect(() => {
    if (state.token === null) {
      navigate("/register");
    }
  }, [state.token, navigate]);


  const getData = async () => {
    const boards = await fetchboards()
    setBoards(boards)
  }





  return (
    <div className="relative overflow-hidden min-h-screen">
      <VantaBackground />
      <div className="relative z-10">
        <div className='text-center mt-5 text-4xl text-[#172B4D]'>Welcome {state.user?.username}  ❤</div>
        <div className='p-2 m-2 text-[#172B4D] font-medium'>Your Boards:</div>
        <div className='flex items-center  flex-wrap p-2 m-2 gap-4'>
          {boards?.map((board) => (
            <HomeBoard key={board.id} id={board.id} title={board.name} image={image1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
