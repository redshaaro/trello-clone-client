import React from 'react'
import VantaBackground from '../components/background/VantaBackground'
import image1 from "../assets/random/image1.jpeg"
import image2 from "../assets/random/image2.jpeg"
import image3 from "../assets/random/image3.jpeg"
import image4 from "../assets/random/image4.jpeg"
import image5 from "../assets/random/image5.jpeg"
import HomeBoard from '../components/HomeBoard'

const Home = () => {
  const boards = [
    { id: 0, title: "board 1", image: image1 },
    { id: 1, title: "board 2", image: image2 },
    { id: 2, title: "board 3", image: image3 },
    { id: 3, title: "board 4", image: image4 },
    { id: 4, title: "board 5", image: image5 },
    { id: 5, title: "board 6", image: image5 }
  ]

  return (
    <div className="relative overflow-hidden min-h-screen">
      <VantaBackground />
      <div className="relative z-10">
        <div className='text-center mt-5 text-4xl text-[#172B4D]'>Welcome Zeyad ❤</div>
        <div className='p-2 m-2 text-[#172B4D] font-medium'>Your Boards:</div>
        <div className='flex items-center justify-between flex-wrap p-2 m-2 gap-1'>
          {
            boards.map((board) => (
              <HomeBoard key={board.id} title={board.title} image={board.image} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home
