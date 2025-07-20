import { arrayMove } from "@dnd-kit/sortable";
export const findDraggedTask = (columns, taskId) => {
  return columns.flatMap(col => col.tasks).find(task => task.id === taskId);
};

export const moveColumn = (columns, activeId, overId) => {
  const oldIndex = columns.findIndex(col => col.id.toString() === activeId);
  const newIndex = columns.findIndex(col => col.id.toString() === overId);
  if (oldIndex === -1 || newIndex === -1) return columns;

  return arrayMove(columns, oldIndex, newIndex);
};

export const moveTask = (columns, activeId, overId) => {
  console.log(`Moving task ${activeId} over ${overId}`);
  
  // Find source column (where task comes from)
  const sourceCol = columns.find(col => 
    col.tasks.some(task => String(task.id) === String(activeId))
  );
  
  if (!sourceCol) {
    console.error("Source column not found for task:", activeId);
    console.error("Available tasks:", columns.flatMap(col => col.tasks.map(t => t.id)));
    return columns;
  }

  // Find target column (where task is going)
  let targetCol;
  if (String(overId).startsWith('column-')) {
    // Dropping on column header
    const columnId = overId.replace('column-', '');
    targetCol = columns.find(col => String(col.id) === columnId);
  } else {
    // Dropping on another task
    targetCol = columns.find(col => 
      col.tasks.some(task => String(task.id) === String(overId))
    );
  }

  if (!targetCol) {
    console.error("Target column not found for over:", overId);
    return columns;
  }

  // Create deep clone of columns to avoid state mutation
  const newColumns = JSON.parse(JSON.stringify(columns));

  // Remove from source column
  const sourceColIndex = newColumns.findIndex(c => c.id === sourceCol.id);
  const taskIndex = newColumns[sourceColIndex].tasks.findIndex(
    t => String(t.id) === String(activeId)
  );
  const [movedTask] = newColumns[sourceColIndex].tasks.splice(taskIndex, 1);

  // Add to target column
  const targetColIndex = newColumns.findIndex(c => c.id === targetCol.id);
  
  if (String(overId).startsWith('column-')) {
    // Add to end if dropped on column
    newColumns[targetColIndex].tasks.push(movedTask);
  } else {
    // Insert at specific position if dropped on task
    const overIndex = newColumns[targetColIndex].tasks.findIndex(
      t => String(t.id) === String(overId)
    );
    newColumns[targetColIndex].tasks.splice(overIndex, 0, movedTask);
  }

  return newColumns;
};