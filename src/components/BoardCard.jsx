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
      className="bg-white p-3 rounded shadow cursor-grab"
    >
      {title}
    </div>
  );
};
export default BoardCard