import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBoardColumnsWithTasks } from '../services/BoardService';

export const useBoard = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBoardColumnsWithTasks(id, state.token);
      const sortedColumns = data.sort((a, b) => a.position - b.position);
      setColumns(sortedColumns);
    } catch (err) {
      console.error('Error loading board:', err);
      
      // Handle 403 Forbidden - user doesn't have access
      if (err.response?.status === 403) {
        setError('Access Denied: You do not have permission to view this board.');
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else if (err.response?.status === 404) {
        setError('Board not found.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Failed to load board. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    columns,
    setColumns,
    boardId: id,
    isLoading,
    error,
  };
};