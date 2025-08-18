import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';

import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableColumn from '../components/SortableColumn';
import BoardCard from '../components/BoardCard';
import { useBoard } from '../hooks/useBoard';
import { useDragHandlers } from '../hooks/useDragHandlers';
import { useEffect, useOptimistic, useState } from 'react';
import { fetchboardname } from '../services/BoardService';
import SimpleModal from '../components/ui/SimpleModal';
import CreateColumnForm from '../components/CreateColumnForm';


const Board = () => {
  const { columns, setColumns, boardId } = useBoard();
  // const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns, (columns, newColumn) => [...columns, newColumn])
  const [boardname, setBoardName] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);






  useEffect(() => {
    const getBoardname = async (boardid) => {
      const res = await fetchboardname(boardid)


      setBoardName(res.data.board[0].name)

    }
    getBoardname(boardId)

  }, [])
  // console.log(boardname)

  const {
    activeTask,
    activeColumn,
    handleDragStart,
    handleDragEnd
  } = useDragHandlers(columns, setColumns);

  const sensors = useSensors(useSensor(PointerSensor));


  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1503264116251-35a269479413")`,
      }}
    >
      <div className='flex items-center justify-between bg-black/50 p-4'>
        <div className="text-white text-3xl ">{boardname}</div>
        <div className='flex items-center gap-3'>
          <div onClick={() => setIsModalOpen(true)} className='text-white cursor-pointer   '><AddCircleIcon className='text-3xl'></AddCircleIcon></div>
          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">Create New Column</h2>


            <CreateColumnForm boardId={boardId} setIsModalOpen={setIsModalOpen} setColumns={setColumns} columns={columns}></CreateColumnForm>
          </SimpleModal>

          <div className='text-white   '><SettingsIcon className='text-3xl'></SettingsIcon></div>







        </div>


      </div>

      <div className="p-6 overflow-x-auto ">
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
                  setColumns={setColumns}
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