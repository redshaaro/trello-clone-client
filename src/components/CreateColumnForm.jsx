import React, { useState } from 'react'
import { createColumn } from '../services/BoardService'

const CreateColumnForm = ({ setIsModalOpen, boardId, setColumns, columns }) => {
  const [name, setName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await createColumn(name, boardId)


      const newColumn = {
        ...res.data.createdColumn,
        tasks: []
      }

      setColumns([...columns, newColumn])
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      alert("Failed to create column. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter column name"
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

export default CreateColumnForm