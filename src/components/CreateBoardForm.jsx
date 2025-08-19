
import { useState } from "react"
import { createBoard } from "../services/BoardService";

const CreateBoardForm = ({ setIsModalOpen, setBoards }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createBoard(name);
      
      if (res) {
        setBoards(prevBoards => [...prevBoards, res]);
        setIsModalOpen(false);
      } else {
        setError('Failed to create board');
      }
    } catch (err) {
      console.error('Error creating board:', err);
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter board name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        type='submit'
        className="bg-[#0C66E4] text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
};
export default CreateBoardForm