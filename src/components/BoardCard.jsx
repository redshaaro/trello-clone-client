import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SimpleModal from "./ui/SimpleModal";
import EditTaskForm from "./EditTaskForm";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";


const BoardCard = ({ id, title, setColumns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isActiveDragging } = useSortable({ id });

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
       className="p-3 mb-2 rounded shadow bg-white hover:bg-gray-50 flex justify-between items-center"
        onClick={() => setIsModalOpen(true)} // open modal on click
      >
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer flex-grow"
        >
          {title}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
           <DragIndicatorIcon fontSize="small" />
           
        </div>
      </div>

      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <EditTaskForm
          taskId={id}
          setIsModalOpen={setIsModalOpen}
          setColumns={setColumns}
        />
      </SimpleModal>
    </>
  );
};

export default BoardCard;
