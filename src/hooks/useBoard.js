import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBoardColumnsWithTasks } from '../services/BoardService';

export const useBoard = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.token) {
      navigate('/register');
    } else {
      loadColumns();
    }
  }, [state.token]);

  const loadColumns = async () => {
    try {
      const data = await fetchBoardColumnsWithTasks(id, state.token);

       
      const sortedColumns = data.sort((a, b) => a.position - b.position);

      setColumns(sortedColumns);
    } catch (err) {
      console.error('Error loading board:', err);
    }
  };

  return {
    columns,
    setColumns,
    boardId: id,
  };
};