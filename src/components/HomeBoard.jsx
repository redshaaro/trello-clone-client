import React from 'react'
import { Link } from 'react-router-dom'

const HomeBoard = ({ title, image }) => {
    return (
        <Link to="/board/2">
            <div className="flex flex-col items-center justify-center 
        shadow-lg m-2 rounded-md p-1 w-[300px] 
        bg-white/80 hover:bg-white/90 transition duration-200 backdrop-blur-sm
        border border-gray-300">

                <img
                    className="w-full h-[168px] rounded-md object-cover"
                    src={image}
                    alt="Preview not available"
                />

                <div className="text-[#172B4D] font-semibold py-2 text-lg">{title}</div>
            </div>
        </Link>
    )
}

export default HomeBoard
