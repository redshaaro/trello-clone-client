import React, { useEffect, useState } from 'react';
import VantaBackground from '../components/background/VantaBackground';
import image1 from "../assets/random/image1.jpeg";
import image2 from "../assets/random/image2.jpeg";
import image3 from "../assets/random/image3.jpeg";
import image4 from "../assets/random/image4.jpeg";
import image5 from "../assets/random/image5.jpeg";
import HomeBoard from '../components/HomeBoard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

const Home = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [boards, setBoards] = useState([])
  useEffect(() => {
    fetchboards()

  }, [])

  useEffect(() => {
    if (state.token === null) {
      navigate("/register");
    }
  }, [state.token, navigate]);


  const fetchboards = async () => {
    try {
      const res = await axios.get("/boards")

      console.log(res)
      setBoards(res.data.boards)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <VantaBackground />
      <div className="relative z-10">
        <div className='text-center mt-5 text-4xl text-[#172B4D]'>Welcome {state.user} ❤</div>
        <div className='p-2 m-2 text-[#172B4D] font-medium'>Your Boards:</div>
        <div className='flex items-center justify-between flex-wrap p-2 m-2 gap-1'>
          {boards.map((board) => (
            <HomeBoard key={board.id} id={board.id} title={board.name} image={image1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
