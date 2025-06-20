// pages/Board.jsx
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import SortableColumn from '../components/SortableColumn'
import BoardCard from '../components/BoardCard'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const Board = () => {
  const { id } = useParams()
  const [activeTask, setActiveTask] = useState(null)

  const [columns, setColumns] = useState([
    {
      id: '1',
      title: 'To Do',
      tasks: [
        { id: 'task-1', title: 'Learn React' },
        { id: 'task-2', title: 'Read Docs' },
      ],
    },
    {
      id: '2',
      title: 'In Progress',
      tasks: [
        { id: 'task-3', title: 'Build UI' },
      ],
    },
    {
      id: '3',
      title: 'Done',
      tasks: [
        { id: 'task-4', title: 'Project Setup' },
      ],
    },
  ])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (event) => {
    const { active } = event
    const task = columns.flatMap((col) => col.tasks).find((task) => task.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const isColumnDrag = active.id.startsWith('column-') && over.id.startsWith('column-');
    if (isColumnDrag) {
      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);
      if (oldIndex !== newIndex) {
        setColumns(arrayMove(columns, oldIndex, newIndex));
      }
      return;
    }

    // Task drag
    const sourceColumnIndex = columns.findIndex(col => col.tasks.some(task => task.id === active.id));
    const destinationColumnIndex = columns.findIndex(col => col.tasks.some(task => task.id === over.id));

    // Handle dropping into empty column
    const isEmptyColumnDrop = columns.find(col => col.id === over.id && col.tasks.length === 0);
    const destinationColIndex = destinationColumnIndex !== -1
      ? destinationColumnIndex
      : columns.findIndex(col => col.id === over.id);

    if (sourceColumnIndex === -1 || destinationColIndex === -1) return;

    const updatedColumns = [...columns];
    const taskToMove = updatedColumns[sourceColumnIndex].tasks.find(t => t.id === active.id);

    // Remove from source
    updatedColumns[sourceColumnIndex].tasks = updatedColumns[sourceColumnIndex].tasks.filter(t => t.id !== active.id);

    // Insert to correct position in destination
    const overTaskIndex = updatedColumns[destinationColIndex].tasks.findIndex(t => t.id === over.id);
    const insertIndex = overTaskIndex === -1 ? updatedColumns[destinationColIndex].tasks.length : overTaskIndex;

    updatedColumns[destinationColIndex].tasks.splice(insertIndex, 0, taskToMove);

    setColumns(updatedColumns);
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("https://images.unsplash.com/photo-1503264116251-35a269479413")` }}
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
            items={columns.map(col => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 w-max">
              {columns.map((col) => (
                <SortableColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={col.tasks}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? <BoardCard id={activeTask.id} title={activeTask.title} isDragging /> : null}          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default Board
