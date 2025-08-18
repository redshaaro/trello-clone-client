import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BoardCard from './BoardCard';
import { useState, useRef, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ColumnSettingsList from './ColumnSettingsList';

const SortableColumn = ({ id,setColumns, title, tasks = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded p-3 w-80 min-h-[300px] max-h-[90vh] overflow-y-auto relative"
    >
      <div className='flex items-center justify-between w-full'>
        {/* Drag handle */}
        <div {...attributes} {...listeners} className="flex-grow cursor-grab">
          <h2 className="font-semibold mb-2 inline-block">{title}</h2>
        </div>

        {/* Settings button */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isOpen ? <CloseIcon /> : <MoreVertIcon />}
          </button>

          {isOpen && <ColumnSettingsList columnId={id.replace('column-', '')} setColumns={setColumns} onClose={() => setIsOpen(false)} />}
        </div>
      </div>

      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <BoardCard key={task.id} id={task.id} title={task.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableColumn;