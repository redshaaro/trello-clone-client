import { useSortable } from "@dnd-kit/sortable";
const BoardCard = ({ id, title, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isActiveDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform,
    transition,
    opacity: isActiveDragging || isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-3 mb-2 cursor-grab rounded shadow bg-white ${isDragging ? 'ring-2 ring-blue-500 opacity-80' : ''
        }`}
    >
      {title}
    </div>
  );
};
export default BoardCard