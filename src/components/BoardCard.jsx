import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SimpleModal from "./ui/SimpleModal";
import EditTaskForm from "./EditTaskForm";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";


const BoardCard = ({ id, title, setColumns, canEdit = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isActiveDragging } = useSortable({ 
    id,
    disabled: !canEdit // Disable dragging for viewers
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActiveDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="p-2 sm:p-3 rounded shadow bg-white hover:bg-gray-50 flex justify-between items-center cursor-pointer transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-grow pr-2 text-sm sm:text-base break-words">
          {title}
        </div>
        {canEdit && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
            onClick={(e) => e.stopPropagation()} // Prevent opening modal when grabbing
          >
            <DragIndicatorIcon fontSize="small" />
          </div>
        )}
      </div>

      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{canEdit ? 'Edit Task' : 'View Task'}</h2>
        {isModalOpen && (
          <EditTaskForm
            taskId={id}
            setIsModalOpen={setIsModalOpen}
            setColumns={setColumns}
            canEdit={canEdit}
          />
        )}
      </SimpleModal>
    </>
  );
};

export default BoardCard;
