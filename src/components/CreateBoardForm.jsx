import React, { useState } from 'react'
import { createBoard } from '../services/BoardService'

const CreateBoardForm = ({ setIsModalOpen }) => {
    const [name, setName] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await createBoard(name)
            console.log(res)
            setIsModalOpen(false)


        } catch (err) {
            console.log(err)
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter board name"

                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
                type='submit'

                className="bg-[#0C66E4] text-white px-4 py-2 rounded"
            >
                Create
            </button>
        </form>
    )
}

export default CreateBoardForm