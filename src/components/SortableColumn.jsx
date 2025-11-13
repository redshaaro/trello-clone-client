import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BoardCard from './BoardCard';
import { useState, useRef, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ColumnSettingsList from './ColumnSettingsList';

const SortableColumn = ({ id, setColumns, title, tasks = [], canEdit = true }) => {
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
  } = useSortable({ 
    id,
    disabled: !canEdit // Disable column dragging for viewers
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded p-3 w-72 sm:w-80 md:w-[320px] min-h-[250px] sm:min-h-[300px] max-h-[calc(100vh-200px)] sm:max-h-[90vh] overflow-y-auto relative flex-shrink-0"
    >
      <div className='flex items-center justify-between w-full mb-3'>
        {/* Drag handle */}
        <div {...attributes} {...listeners} className={`flex-grow ${canEdit ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}>
          <h2 className="font-semibold text-sm sm:text-base">{title}</h2>
        </div>

        {/* Settings button - Only show if user can edit */}
        {canEdit && (
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isOpen ? <CloseIcon fontSize="small" /> : <MoreVertIcon fontSize="small" />}
            </button>

            {isOpen && <ColumnSettingsList columnId={id.replace('column-', '')} columnName={title} setColumns={setColumns} onClose={() => setIsOpen(false)} />}
          </div>
        )}
      </div>

      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 sm:gap-3">
          {tasks.map(task => (
            <BoardCard setColumns={setColumns} key={task.id} id={task.id} title={task.title} canEdit={canEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default SortableColumn;