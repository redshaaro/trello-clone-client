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
  const { boards, setBoards } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.token) {
      getData();
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token === undefined) return; // still loading
    if (state.token === null) navigate("/register");
  }, [state.token, navigate]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const boardsData = await fetchboards();
      setBoards(boardsData); // { ownedBoards: [], invitedBoards: [] }
    } catch (err) {
      console.error("Error fetching boards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <VantaBackground />
      <div className="relative z-10 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mt-5 text-2xl sm:text-3xl md:text-4xl text-[#172B4D] px-4">
          Welcome {state.user?.username} ❤
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <div className="text-[#172B4D] text-base sm:text-lg">Loading your boards...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Owned Boards */}
            <div className="px-4 py-3 text-[#172B4D] font-medium text-lg sm:text-xl">Your Boards:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-4 pb-6">
              {boards?.ownedBoards?.length > 0 ? (
                boards.ownedBoards.map((board) => (
                  <HomeBoard
                    key={board.id}
                    id={board.id}
                    title={board.name}
                    image={image1}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm sm:text-base col-span-full text-center py-8">
                  No boards created yet. Click "Create" or "+ New" to get started!
                </p>
              )}
            </div>

            {/* Member Boards */}
            <div className="px-4 py-3 text-[#172B4D] font-medium text-lg sm:text-xl">Boards you're a member of:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 px-4 pb-6">
              {boards?.invitedBoards?.length > 0 ? (
                boards.invitedBoards.map((board) => (
                  <HomeBoard
                    key={board.id}
                    id={board.id}
                    title={board.name}
                    image={image1}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm sm:text-base col-span-full text-center py-8">
                  Not part of any boards yet
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
