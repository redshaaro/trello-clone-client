// pages/Board.jsx
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableColumn from '../components/SortableColumn';
import BoardCard from '../components/BoardCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Board = () => {
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const navigate = useNavigate();
  const { state } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!state.token) {
      navigate('/register');
    } else {
      fetchColumns();
    }
  }, [state.token]);

  const fetchColumns = async () => {
    try {
      const colRes = await axios.get(`http://localhost:3000/api/columns/${id}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      const fetchedColumns = colRes.data.columns;

      const columnsWithTasks = await Promise.all(
        fetchedColumns.map(async (col) => {
          const taskRes = await axios.get(`http://localhost:3000/api/tasks/${col.id}`, {
            headers: { Authorization: `Bearer ${state.token}` },
          });

          return {
            ...col,
            tasks: taskRes.data.tasks || [],
          };
        })
      );

      setColumns(columnsWithTasks);
    } catch (err) {
      console.error('Error fetching columns or tasks:', err);
    }
  };

  const handleDragStart = ({ active }) => {
    // Check if we're dragging a column
    if (active.id.toString().startsWith('column-')) {
      setActiveColumn(columns.find(col => `column-${col.id}` === active.id));
      return;
    }

    // Otherwise we're dragging a task
    const task = columns.flatMap(col => col.tasks).find(task => task.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // Update your handleDragEnd function with these changes:

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Handle column sorting
    if (activeId.toString().startsWith('column-') && overId.toString().startsWith('column-')) {
      const fromIndex = columns.findIndex(col => `column-${col.id}` === activeId);
      const toIndex = columns.findIndex(col => `column-${col.id}` === overId);

      if (fromIndex !== toIndex) {
        setColumns(arrayMove(columns, fromIndex, toIndex));
      }
      return;
    }

    // Handle task movement
    if (!activeId.toString().startsWith('column-')) {
      // Find source column (where the task comes from)
      const sourceColIndex = columns.findIndex(col =>
        col.tasks.some(task => task.id === activeId)
      );

      // Find target column (where the task is going to)
      let targetColIndex;

      if (overId.toString().startsWith('column-')) {
        // Dropping on a column (empty space)
        targetColIndex = columns.findIndex(col => `column-${col.id}` === overId);
      } else {
        // Dropping on a task
        targetColIndex = columns.findIndex(col =>
          col.tasks.some(task => task.id === overId)
        );
      }

      if (sourceColIndex === -1 || targetColIndex === -1) return;

      const sourceCol = columns[sourceColIndex];
      const targetCol = columns[targetColIndex];

      // Find the task being moved
      const taskIndex = sourceCol.tasks.findIndex(task => task.id === activeId);
      const task = sourceCol.tasks[taskIndex];

      // Create new arrays to avoid mutation
      const newColumns = [...columns];

      if (sourceColIndex === targetColIndex) {
        // Reordering within the same column
        const overIndex = targetCol.tasks.findIndex(task => task.id === overId);
        if (taskIndex === overIndex) return; // No change needed

        const newTasks = arrayMove(sourceCol.tasks, taskIndex, overIndex);
        newColumns[sourceColIndex] = {
          ...sourceCol,
          tasks: newTasks,
        };
      } else {
        // Moving between columns
        const newSourceTasks = [...sourceCol.tasks];
        newSourceTasks.splice(taskIndex, 1); // Remove from source

        let newTargetTasks = [...targetCol.tasks];
        if (overId.toString().startsWith('column-')) {
          // If dropped on column (empty space), add to the end
          newTargetTasks.push(task);
        } else {
          // If dropped on a task, insert at that position
          const overIndex = targetCol.tasks.findIndex(task => task.id === overId);
          newTargetTasks.splice(overIndex, 0, task);
        }

        newColumns[sourceColIndex] = {
          ...sourceCol,
          tasks: newSourceTasks,
        };
        newColumns[targetColIndex] = {
          ...targetCol,
          tasks: newTargetTasks,
        };
      }

      setColumns(newColumns);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1503264116251-35a269479413")`,
      }}
    >
      <div className="text-white text-3xl p-4 bg-black/50">Board: {id}</div>
      <div className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map(col => `column-${col.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 w-max">
              {columns.map(col => (
                <SortableColumn
                  key={`column-${col.id}`}
                  id={`column-${col.id}`}
                  title={col.name}
                  tasks={col.tasks}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? (
              <BoardCard id={activeTask.id} title={activeTask.title} isDragging />
            ) : activeColumn ? (
              <div className="w-64 bg-gray-100 rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg">{activeColumn.name}</h3>
                <div className="mt-2 space-y-2">
                  {activeColumn.tasks.map(task => (
                    <BoardCard key={task.id} id={task.id} title={task.title} />
                  ))}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;