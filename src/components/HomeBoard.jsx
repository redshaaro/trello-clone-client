import React from 'react'
import { Link } from 'react-router-dom'

const HomeBoard = ({ id, title, image }) => {
    return (
        <Link to={`/board/${id}`} className="w-full">
            <div className="flex flex-col items-center justify-center 
        shadow-lg rounded-md p-1 w-full
        bg-white/80 hover:bg-white/90 transition-transform hover:scale-105 duration-200 backdrop-blur-sm
        border border-gray-300">

                <img
                    className="w-full h-32 sm:h-40 md:h-[168px] rounded-md object-cover"
                    src={image}
                    alt="Preview not available"
                />

                <div className="text-[#172B4D] font-semibold py-2 text-sm sm:text-base md:text-lg truncate w-full text-center px-2">{title}</div>
            </div>
        </Link>
    )
}

export default HomeBoard
