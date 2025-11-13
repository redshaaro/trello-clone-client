import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import BoardCard from './BoardCard'

const Column = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="...your styles...">
      <h2>{title}</h2>
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <BoardCard key={task.id} id={task.id} title={task.title} />
        ))}
      </SortableContext>
    </div>
  )
}
export default Column